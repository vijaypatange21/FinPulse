from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AnomalyDetectionView,
    AsyncTaskStatusView,
    BorrowerDocumentViewSet,
    BorrowerProfileViewSet,
    BorrowerRegistrationView,
    CashFlowForecastView,
    DefaultRiskPredictionView,
    HealthScorePredictionView,
    QueueApplicationProcessingView,
    QueueBorrowerRefreshView,
    QueueLenderOverviewView,
    LenderProfileViewSet,
    LenderRegistrationView,
    LoanApplicationViewSet,
    LoginView,
    WellnessRecommendationView,
    health_check,
)

router = DefaultRouter()
router.register(r"borrowers", BorrowerProfileViewSet, basename="borrowers")
router.register(r"lenders", LenderProfileViewSet, basename="lenders")
router.register(r"applications", LoanApplicationViewSet, basename="applications")
router.register(r"documents", BorrowerDocumentViewSet, basename="documents")

urlpatterns = [
    path("health/", health_check, name="health-check"),
    path("auth/register/borrower/", BorrowerRegistrationView.as_view(), name="register-borrower"),
    path("auth/register/lender/", LenderRegistrationView.as_view(), name="register-lender"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("predict/health-score/", HealthScorePredictionView.as_view(), name="predict-health-score"),
    path("predict/default-risk/", DefaultRiskPredictionView.as_view(), name="predict-default-risk"),
    path("detect/anomaly/", AnomalyDetectionView.as_view(), name="detect-anomaly"),
    path("forecast/balance/", CashFlowForecastView.as_view(), name="forecast-balance"),
    path("recommend/wellness/", WellnessRecommendationView.as_view(), name="recommend-wellness"),
    path("queue/tasks/<str:task_id>/", AsyncTaskStatusView.as_view(), name="queue-task-status"),
    path(
        "queue/applications/<uuid:application_id>/process/",
        QueueApplicationProcessingView.as_view(),
        name="queue-application-process",
    ),
    path(
        "queue/borrowers/<uuid:borrower_id>/refresh/",
        QueueBorrowerRefreshView.as_view(),
        name="queue-borrower-refresh",
    ),
    path(
        "queue/lenders/<uuid:lender_id>/overview/",
        QueueLenderOverviewView.as_view(),
        name="queue-lender-overview",
    ),
    path("", include(router.urls)),
]
