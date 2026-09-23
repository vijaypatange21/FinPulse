import threading
from django.db.models import Q
from celery.result import AsyncResult
from rest_framework import permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from .ml.service import MLModelService
from .models import BorrowerDocument, BorrowerProfile, LenderDocument, LenderProfile, LoanApplication, Notification, User
from .parsers.bank_statement import apply_verified_document_metrics, parse_and_process_bank_statement
from .services.notification_service import broadcast_role_notification, create_and_send_notification
from .tasks import (
    build_lender_overview_task,
    parse_bank_statement_task,
    process_loan_application_task,
    refresh_borrower_snapshot_task,
    run_post_registration_tasks,
)
from .serializers import (
    BorrowerDocumentSerializer,
    BorrowerProfileSerializer,
    BorrowerRegistrationSerializer,
    LenderDocumentSerializer,
    LenderProfileSerializer,
    LenderRegistrationSerializer,
    LoanApplicationSerializer,
    LoginSerializer,
    NotificationSerializer,
    UserSerializer,
)

ml_service = MLModelService()


def safe_delay(task_func, *args, **kwargs):
    """
    Safely trigger a Celery task. If Redis/Celery broker is unavailable,
    fallback to synchronous execution so API requests never fail with 500.
    """
    try:
        task_res = task_func.delay(*args, **kwargs)
        return getattr(task_res, "id", "local-task")
    except Exception:
        try:
            task_func(*args, **kwargs)
        except Exception:
            pass
        return "local-task"


class BorrowerRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = BorrowerRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        task_id = safe_delay(run_post_registration_tasks, user.id)
        return Response(
            {
                "message": "Borrower registered successfully.",
                "token": token.key,
                "user": UserSerializer(user).data,
                "background_task_id": task_id,
            },
            status=status.HTTP_201_CREATED,
        )


class LenderRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LenderRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        task_id = safe_delay(run_post_registration_tasks, user.id)
        return Response(
            {
                "message": "Lender registered successfully.",
                "token": token.key,
                "user": UserSerializer(user).data,
                "background_task_id": task_id,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "token": token.key,
                "user": UserSerializer(user).data,
            }
        )


from .ml.underwriter import evaluate_and_score_application

class BorrowerProfileViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BorrowerProfileSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return BorrowerProfile.objects.none()

        if user.role == User.Role.BORROWER and hasattr(user, "borrower_profile"):
            return BorrowerProfile.objects.filter(user=user)

        if user.role == User.Role.LENDER and hasattr(user, "lender_profile"):
            lender = user.lender_profile
            return BorrowerProfile.objects.filter(applications__preferred_lender=lender).distinct()

        if user.is_staff or user.role == User.Role.ADMIN:
            return BorrowerProfile.objects.select_related("user").all()

        return BorrowerProfile.objects.none()


class LenderProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LenderProfile.objects.select_related("user").all()
    serializer_class = LenderProfileSerializer


class LoanApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = LoanApplicationSerializer

    def get_queryset(self):
        queryset = LoanApplication.objects.all().select_related("borrower", "preferred_lender")
        user = self.request.user

        if not user.is_authenticated:
            return LoanApplication.objects.none()

        if user.role == user.Role.BORROWER and hasattr(user, "borrower_profile"):
            return queryset.filter(borrower=user.borrower_profile)

        if user.role == user.Role.LENDER and hasattr(user, "lender_profile"):
            lender = user.lender_profile
            return queryset.filter(preferred_lender=lender)

        if user.is_staff or user.role == User.Role.ADMIN:
            return queryset

        return LoanApplication.objects.none()

    def create(self, request, *args, **kwargs):
        data = request.data.copy() if hasattr(request.data, "copy") else dict(request.data)
        if request.user.is_authenticated and hasattr(request.user, "borrower_profile"):
            if not data.get("borrower"):
                data["borrower"] = str(request.user.borrower_profile.borrower_id)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        application = serializer.save()

        try:
            application = evaluate_and_score_application(application)
        except Exception:
            pass

        task_id = safe_delay(process_loan_application_task, str(application.application_id))

        res_data = self.get_serializer(application).data
        res_data["background_task_id"] = task_id
        headers = self.get_success_headers(res_data)
        return Response(res_data, status=status.HTTP_201_CREATED, headers=headers)


    def perform_update(self, serializer):
        application = serializer.save()
        if application.status == LoanApplication.Status.APPROVED:
            borrower = application.borrower
            borrower.principal_amount = application.requested_amount
            borrower.outstanding_amount = application.requested_amount
            borrower.loan_type = application.loan_type
            borrower.status = BorrowerProfile.Status.ON_TRACK
            borrower.save(update_fields=["principal_amount", "outstanding_amount", "loan_type", "status", "updated_at"])

            create_and_send_notification(
                recipient=borrower.user,
                title="Loan Application Approved",
                message=f"Congratulations! Your {application.loan_type} application of ₹{int(application.requested_amount):,} has been approved.",
                notification_type=Notification.NotificationType.LOAN,
                action_url="/borrower/loans",
            )
        elif application.status == LoanApplication.Status.REJECTED:
            create_and_send_notification(
                recipient=application.borrower.user,
                title="Loan Application Update",
                message=f"Your {application.loan_type} application of ₹{int(application.requested_amount):,} was not approved at this time.",
                notification_type=Notification.NotificationType.WARNING,
                action_url="/borrower/loans",
            )



class HealthScorePredictionView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(ml_service.predict_health_score(request.data), status=status.HTTP_200_OK)


class DefaultRiskPredictionView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(ml_service.predict_default_risk(request.data), status=status.HTTP_200_OK)


class AnomalyDetectionView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(ml_service.detect_anomaly(request.data), status=status.HTTP_200_OK)


class CashFlowForecastView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(ml_service.forecast_balance(request.data), status=status.HTTP_200_OK)


class WellnessRecommendationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(ml_service.recommend_wellness(request.data), status=status.HTTP_200_OK)


class AsyncTaskStatusView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, _request, task_id):
        task = AsyncResult(task_id)
        payload = {
            "task_id": task_id,
            "state": task.state,
            "ready": task.ready(),
            "successful": task.successful() if task.ready() else False,
        }
        if task.ready():
            payload["result"] = task.result
        return Response(payload, status=status.HTTP_200_OK)


class QueueApplicationProcessingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, _request, application_id):
        try:
            LoanApplication.objects.get(application_id=application_id)
        except LoanApplication.DoesNotExist as exc:
            raise NotFound("Application not found") from exc

        task_id = safe_delay(process_loan_application_task, str(application_id))
        return Response({"task_id": task_id, "application_id": str(application_id)}, status=status.HTTP_202_ACCEPTED)


class QueueBorrowerRefreshView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, _request, borrower_id):
        try:
            BorrowerProfile.objects.get(borrower_id=borrower_id)
        except BorrowerProfile.DoesNotExist as exc:
            raise NotFound("Borrower not found") from exc

        task_id = safe_delay(refresh_borrower_snapshot_task, str(borrower_id))
        return Response({"task_id": task_id, "borrower_id": str(borrower_id)}, status=status.HTTP_202_ACCEPTED)


class QueueLenderOverviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, _request, lender_id):
        try:
            LenderProfile.objects.get(lender_id=lender_id)
        except LenderProfile.DoesNotExist as exc:
            raise NotFound("Lender not found") from exc

        task_id = safe_delay(build_lender_overview_task, str(lender_id))
        return Response({"task_id": task_id, "lender_id": str(lender_id)}, status=status.HTTP_202_ACCEPTED)


def _run_async_parse(doc_id):
    from django.db import connection
    try:
        connection.close()
        parse_and_process_bank_statement(doc_id, simulated_delay_seconds=2.0)
    except Exception:
        pass
    finally:
        connection.close()


class BorrowerDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = BorrowerDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return BorrowerDocument.objects.none()

        if user.is_staff or user.role in [User.Role.ADMIN, User.Role.LENDER]:
            return BorrowerDocument.objects.all().select_related("borrower__user", "verified_by")

        try:
            profile = user.borrower_profile
            return BorrowerDocument.objects.filter(borrower=profile).select_related("borrower__user", "verified_by")
        except (BorrowerProfile.DoesNotExist, AttributeError):
            return BorrowerDocument.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        profile = getattr(user, "borrower_profile", None)
        if not profile:
            profile, _ = BorrowerProfile.objects.get_or_create(
                user=user,
                defaults={"name": user.get_full_name() or user.username},
            )
        file_obj = self.request.FILES.get("file")
        file_name = file_obj.name if file_obj else "document.pdf"

        size_bytes = file_obj.size if file_obj else 0
        if size_bytes < 1024 * 1024:
            file_size = f"{round(size_bytes / 1024, 1)} KB"
        else:
            file_size = f"{round(size_bytes / (1024 * 1024), 1)} MB"

        doc = serializer.save(
            borrower=profile,
            file_name=file_name,
            file_size=file_size,
            status="processing",
        )

        broadcast_role_notification(
            role="admin",
            title="New Document Uploaded",
            message=f"{profile.display_name} uploaded {doc.get_document_type_display()} for review.",
            notification_type=Notification.NotificationType.DOCUMENT,
            action_url="/admin/documents",
        )

        safe_delay(parse_bank_statement_task, str(doc.id))
        try:
            import sys
            if "test" not in sys.argv:
                threading.Thread(target=_run_async_parse, args=(doc.id,), daemon=True).start()
        except Exception:
            pass

    @action(detail=True, methods=["post"])
    def reparse(self, request, pk=None):
        doc = self.get_object()
        doc.status = "processing"
        doc.save(update_fields=["status"])
        safe_delay(parse_bank_statement_task, str(doc.id))
        try:
            import sys
            if "test" not in sys.argv:
                threading.Thread(target=_run_async_parse, args=(doc.id,), daemon=True).start()
        except Exception:
            pass
        return Response({"status": "processing", "message": "Parsing triggered with simulated delay."})

    @action(detail=True, methods=["post"])
    def verify(self, request, pk=None):
        user = request.user
        # STRICT SECURITY: Only platform administrators or staff can approve documents.
        # Lenders CANNOT approve documents.
        if not (user.is_staff or user.role == User.Role.ADMIN):
            return Response(
                {"error": "Forbidden: Only platform administrators can verify and approve documents."},
                status=status.HTTP_403_FORBIDDEN,
            )
        doc = self.get_object()
        notes = request.data.get("notes", "")
        new_score = apply_verified_document_metrics(doc, verified_by_user=request.user, notes=notes)

        # Send real-time notification to borrower
        create_and_send_notification(
            recipient=doc.borrower.user,
            title="Document Verified & Approved",
            message=f"Your {doc.get_document_type_display()} has been approved. Updated Health Score: {new_score}",
            notification_type=Notification.NotificationType.SUCCESS,
            action_url="/borrower/health-score",
        )

        serializer = self.get_serializer(doc)
        return Response({
            "message": "Document successfully approved and verified.",
            "document": serializer.data,
            "borrower_health_score": new_score,
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        user = request.user
        # STRICT SECURITY: Only platform administrators or staff can reject documents.
        # Lenders CANNOT reject documents.
        if not (user.is_staff or user.role == User.Role.ADMIN):
            return Response(
                {"error": "Forbidden: Only platform administrators can reject documents."},
                status=status.HTTP_403_FORBIDDEN,
            )
        doc = self.get_object()
        reason = request.data.get("reason", "Document does not satisfy verification or legibility criteria.")
        notes = request.data.get("notes", "")
        doc.status = "rejected"
        doc.rejection_reason = reason
        doc.verification_notes = notes
        doc.verified_by = request.user
        doc.save(update_fields=["status", "rejection_reason", "verification_notes", "verified_by", "updated_at"])

        # Send real-time notification to borrower
        create_and_send_notification(
            recipient=doc.borrower.user,
            title="Document Verification Rejected",
            message=f"Your {doc.get_document_type_display()} could not be verified: {reason}",
            notification_type=Notification.NotificationType.WARNING,
            action_url="/borrower/upload",
        )

        serializer = self.get_serializer(doc)
        return Response({
            "message": "Document marked as rejected.",
            "document": serializer.data,
        }, status=status.HTTP_200_OK)


class LenderDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = LenderDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return LenderDocument.objects.none()

        if user.is_staff or user.role == User.Role.ADMIN:
            return LenderDocument.objects.all().select_related("lender__user", "verified_by")

        try:
            profile = user.lender_profile
            return LenderDocument.objects.filter(lender=profile).select_related("lender__user", "verified_by")
        except (LenderProfile.DoesNotExist, AttributeError):
            return LenderDocument.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        try:
            profile = user.lender_profile
        except (LenderProfile.DoesNotExist, AttributeError):
            return Response({"error": "Only registered lenders can upload compliance documents."}, status=status.HTTP_400_BAD_REQUEST)

        file_obj = self.request.FILES.get("file")
        file_name = file_obj.name if file_obj else "document.pdf"
        size_bytes = file_obj.size if file_obj else 0
        file_size = f"{round(size_bytes / 1024, 1)} KB" if size_bytes < 1024 * 1024 else f"{round(size_bytes / (1024 * 1024), 1)} MB"

        doc = serializer.save(
            lender=profile,
            file_name=file_name,
            file_size=file_size,
            status="pending_review",
        )

        broadcast_role_notification(
            role="admin",
            title="New Institutional Compliance Document",
            message=f"{profile.institution_name} uploaded {doc.get_document_type_display()} for accreditation review.",
            notification_type=Notification.NotificationType.COMPLIANCE,
            action_url="/admin/documents",
        )

    @action(detail=True, methods=["post"])
    def verify(self, request, pk=None):
        user = request.user
        if not (user.is_staff or user.role == User.Role.ADMIN):
            return Response(
                {"error": "Forbidden: Only platform administrators can verify institutional documents."},
                status=status.HTTP_403_FORBIDDEN,
            )
        doc = self.get_object()
        notes = request.data.get("notes", "")
        doc.status = "verified"
        doc.verified_by = user
        doc.verification_notes = notes
        doc.save(update_fields=["status", "verified_by", "verification_notes", "updated_at"])

        lender = doc.lender
        lender.verification_status = LenderProfile.VerificationStatus.VERIFIED
        lender.save(update_fields=["verification_status"])

        create_and_send_notification(
            recipient=lender.user,
            title="Institutional Accreditation Approved",
            message=f"Your {doc.get_document_type_display()} has been approved. Your institution is fully verified.",
            notification_type=Notification.NotificationType.SUCCESS,
            action_url="/lender/dashboard",
        )

        serializer = self.get_serializer(doc)
        return Response({
            "message": "Institutional document successfully verified.",
            "document": serializer.data,
            "verification_status": lender.verification_status,
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        user = request.user
        if not (user.is_staff or user.role == User.Role.ADMIN):
            return Response(
                {"error": "Forbidden: Only platform administrators can reject institutional documents."},
                status=status.HTTP_403_FORBIDDEN,
            )
        doc = self.get_object()
        reason = request.data.get("reason", "Institutional compliance criteria not met.")
        notes = request.data.get("notes", "")
        doc.status = "rejected"
        doc.rejection_reason = reason
        doc.verification_notes = notes
        doc.verified_by = user
        doc.save(update_fields=["status", "rejection_reason", "verification_notes", "verified_by", "updated_at"])

        create_and_send_notification(
            recipient=doc.lender.user,
            title="Institutional Document Action Required",
            message=f"Your {doc.get_document_type_display()} was rejected: {reason}",
            notification_type=Notification.NotificationType.WARNING,
            action_url="/lender/dashboard",
        )

        serializer = self.get_serializer(doc)
        return Response({
            "message": "Institutional document rejected.",
            "document": serializer.data,
        }, status=status.HTTP_200_OK)


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Notification.objects.filter(recipient=user).order_by("-created_at")
        if self.request.query_params.get("unread", "").lower() == "true":
            qs = qs.filter(is_read=False)
        return qs

    @action(detail=True, methods=["post"])
    def read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=["is_read", "updated_at"])
        return Response({"status": "ok", "message": "Marked as read."})

    @action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({"status": "ok", "message": "All notifications marked as read."})

    @action(detail=False, methods=["get"])
    def unread_count(self, request):
        count = Notification.objects.filter(recipient=request.user, is_read=False).count()
        return Response({"unread_count": count})


class AdminDashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if not (user.is_staff or user.role == User.Role.ADMIN):
            return Response({"error": "Forbidden: Platform administrator access required."}, status=status.HTTP_403_FORBIDDEN)

        from django.db.models import Sum
        total_borrowers = BorrowerProfile.objects.count()
        total_lenders = LenderProfile.objects.count()
        verified_lenders = LenderProfile.objects.filter(verification_status=LenderProfile.VerificationStatus.VERIFIED).count()
        pending_borrower_docs = BorrowerDocument.objects.filter(status__in=["pending_review", "processing"]).count()
        pending_lender_docs = LenderDocument.objects.filter(status__in=["pending_review", "under_review"]).count()
        total_loans = LoanApplication.objects.count()
        approved_loans = LoanApplication.objects.filter(status=LoanApplication.Status.APPROVED).count()

        vol_req = LoanApplication.objects.aggregate(total=Sum("requested_amount"))["total"] or 0
        vol_disb = BorrowerProfile.objects.aggregate(total=Sum("principal_amount"))["total"] or 0

        recent_borrower_docs = BorrowerDocument.objects.select_related("borrower__user").order_by("-created_at")[:5]
        recent_lender_docs = LenderDocument.objects.select_related("lender").order_by("-created_at")[:5]

        activities = []
        for d in recent_borrower_docs:
            activities.append({
                "id": f"b_{d.id}",
                "type": "borrower_doc",
                "title": f"Borrower: {d.get_document_type_display()}",
                "user": d.borrower.display_name,
                "status": d.status,
                "time": d.created_at.isoformat(),
            })
        for d in recent_lender_docs:
            activities.append({
                "id": f"l_{d.id}",
                "type": "lender_doc",
                "title": f"Institution: {d.get_document_type_display()}",
                "user": d.lender.institution_name,
                "status": d.status,
                "time": d.created_at.isoformat(),
            })
        activities.sort(key=lambda x: x["time"], reverse=True)

        return Response({
            "kpis": {
                "total_borrowers": total_borrowers,
                "total_lenders": total_lenders,
                "verified_lenders": verified_lenders,
                "pending_borrower_docs": pending_borrower_docs,
                "pending_lender_docs": pending_lender_docs,
                "total_pending_verifications": pending_borrower_docs + pending_lender_docs,
                "total_loans": total_loans,
                "approved_loans": approved_loans,
                "volume_requested": float(vol_req),
                "volume_disbursed": float(vol_disb),
            },
            "recent_activities": activities[:8],
            "system_health": {
                "celery_broker": "Operational",
                "websocket_gateway": "Active",
                "ml_underwriter_status": "Online (v2.4)",
                "active_models": ["XGBoost Default Classifier", "Isolation Forest Anomaly", "ARIMA Forecaster", "Neural Credit Score"],
            },
        }, status=status.HTTP_200_OK)


class AdminUserManagementView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if not (user.is_staff or user.role == User.Role.ADMIN):
            return Response({"error": "Forbidden: Platform administrator access required."}, status=status.HTTP_403_FORBIDDEN)

        users = User.objects.all().order_by("-date_joined")
        data = []
        for u in users:
            entity_name = u.get_full_name() or u.username
            details = {}
            if u.role == User.Role.BORROWER and hasattr(u, "borrower_profile"):
                bp = u.borrower_profile
                entity_name = bp.display_name
                details = {
                    "health_score": bp.health_score,
                    "risk_level": bp.risk_level,
                    "city": bp.city,
                    "occupation": bp.occupation,
                }
            elif u.role == User.Role.LENDER and hasattr(u, "lender_profile"):
                lp = u.lender_profile
                entity_name = lp.institution_name
                details = {
                    "institution_type": lp.institution_type,
                    "verification_status": lp.verification_status,
                    "monthly_volume": float(lp.monthly_loan_volume),
                }

            data.append({
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "role": u.role,
                "name": entity_name,
                "is_active": u.is_active,
                "is_staff": u.is_staff,
                "date_joined": u.date_joined.isoformat(),
                "details": details,
            })
        return Response({"users": data}, status=status.HTTP_200_OK)

    def patch(self, request, user_id=None):
        user = request.user
        if not (user.is_staff or user.role == User.Role.ADMIN):
            return Response({"error": "Forbidden."}, status=status.HTTP_403_FORBIDDEN)
        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if "is_active" in request.data:
            target_user.is_active = bool(request.data["is_active"])
        if "role" in request.data and request.data["role"] in [User.Role.BORROWER, User.Role.LENDER, User.Role.ADMIN]:
            target_user.role = request.data["role"]
        target_user.save()

        if "verification_status" in request.data and hasattr(target_user, "lender_profile"):
            lp = target_user.lender_profile
            lp.verification_status = request.data["verification_status"]
            lp.save(update_fields=["verification_status"])

        return Response({"message": f"User {target_user.username} updated successfully."})




@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def health_check(_request):
    return Response({"status": "ok", "service": "finpulse-backend"})

