from celery import shared_task
from django.utils import timezone

from .ml.service import MLModelService
from .models import (
    BankSummaryDim,
    BorrowerProfile,
    LenderProfile,
    LoanApplication,
    MasterMLTrainingTable,
    User,
)


@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=3, retry_kwargs={"max_retries": 3})
def run_post_registration_tasks(self, user_id):
    user = User.objects.get(id=user_id)

    if user.role == User.Role.BORROWER and hasattr(user, "borrower_profile"):
        borrower = user.borrower_profile
        BankSummaryDim.objects.get_or_create(borrower=borrower)
        MasterMLTrainingTable.objects.get_or_create(borrower=borrower)
    elif user.role == User.Role.LENDER and hasattr(user, "lender_profile"):
        LenderProfile.objects.filter(pk=user.lender_profile.pk).update(updated_at=timezone.now())

    return {"user_id": user_id, "status": "completed", "task": "post_registration"}


@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=3, retry_kwargs={"max_retries": 3})
def process_loan_application_task(self, application_id):
    application = LoanApplication.objects.select_related("borrower").get(application_id=application_id)

    if application.status == LoanApplication.Status.NEW:
        application.status = LoanApplication.Status.UNDER_REVIEW
        application.save(update_fields=["status", "updated_at"])

    borrower = application.borrower
    ml_service = MLModelService()

    synthetic_payload = {
        "features": {
            "monthly_income": 50000,
            "total_expense": 32000,
            "savings_rate": 0.18,
            "emi_income_ratio": 0.24,
            "cashflow_volatility": 0.16,
        }
    }

    health_result = ml_service.predict_health_score(synthetic_payload)
    BankSummaryDim.objects.get_or_create(
        borrower=borrower,
        defaults={"financial_stress_index": max(0.0, 100.0 - float(health_result.get("health_score", 50.0)) / 100.0)},
    )

    return {
        "application_id": str(application.application_id),
        "status": "queued-processing-complete",
        "health_score": health_result,
    }


@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=3, retry_kwargs={"max_retries": 3})
def refresh_borrower_snapshot_task(self, borrower_id):
    borrower = BorrowerProfile.objects.get(borrower_id=borrower_id)

    BankSummaryDim.objects.get_or_create(borrower=borrower)
    MasterMLTrainingTable.objects.get_or_create(borrower=borrower)

    return {"borrower_id": str(borrower.borrower_id), "status": "snapshot-refreshed"}


@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=3, retry_kwargs={"max_retries": 3})
def build_lender_overview_task(self, lender_id):
    lender = LenderProfile.objects.get(lender_id=lender_id)
    lender_apps = LoanApplication.objects.filter(preferred_lender=lender)

    payload = {
        "lender_id": str(lender.lender_id),
        "institution_name": lender.institution_name,
        "total_applications": lender_apps.count(),
        "new_applications": lender_apps.filter(status=LoanApplication.Status.NEW).count(),
        "under_review": lender_apps.filter(status=LoanApplication.Status.UNDER_REVIEW).count(),
        "approved": lender_apps.filter(status=LoanApplication.Status.APPROVED).count(),
        "rejected": lender_apps.filter(status=LoanApplication.Status.REJECTED).count(),
    }
    return payload
