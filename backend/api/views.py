from django.db.models import Q
from celery.result import AsyncResult
from rest_framework import permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from .ml.service import MLModelService
from .models import BorrowerDocument, BorrowerProfile, LenderProfile, LoanApplication
from .tasks import (
    build_lender_overview_task,
    process_loan_application_task,
    refresh_borrower_snapshot_task,
    run_post_registration_tasks,
)
from .serializers import (
    BorrowerDocumentSerializer,
    BorrowerProfileSerializer,
    BorrowerRegistrationSerializer,
    LenderProfileSerializer,
    LenderRegistrationSerializer,
    LoanApplicationSerializer,
    LoginSerializer,
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


class BorrowerProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BorrowerProfile.objects.select_related("user").all()
    serializer_class = BorrowerProfileSerializer


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
            return queryset.filter(Q(preferred_lender=lender) | Q(preferred_lender__isnull=True))

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        application = serializer.save()
        task_id = safe_delay(process_loan_application_task, str(application.application_id))

        data = self.get_serializer(application).data
        data["background_task_id"] = task_id
        headers = self.get_success_headers(data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)


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


class BorrowerDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = BorrowerDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return BorrowerDocument.objects.none()
        try:
            profile = user.borrower_profile
            return BorrowerDocument.objects.filter(borrower=profile)
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

        serializer.save(
            borrower=profile,
            file_name=file_name,
            file_size=file_size,
            status="verified",
        )


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def health_check(_request):
    return Response({"status": "ok", "service": "finpulse-backend"})

