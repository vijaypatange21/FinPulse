import uuid

from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class User(AbstractUser):
    class Role(models.TextChoices):
        BORROWER = "borrower", "Borrower"
        LENDER = "lender", "Lender"
        ADMIN = "admin", "Admin"

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices)

    REQUIRED_FIELDS = ["email", "role"]

    def __str__(self):
        return f"{self.username} ({self.role})"


class BorrowerProfile(TimeStampedModel):
    class RiskLevel(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"

    class RiskColor(models.TextChoices):
        GREEN = "green", "Green"
        YELLOW = "yellow", "Yellow"
        RED = "red", "Red"

    class Status(models.TextChoices):
        ON_TRACK = "On Track", "On Track"
        OVERDUE = "Overdue", "Overdue"
        GRACE_PERIOD = "Grace Period", "Grace Period"
        CLOSED = "Closed", "Closed"

    borrower_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="borrower_profile")
    phone_number = models.CharField(max_length=20, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    occupation = models.CharField(max_length=120, blank=True)
    avatar_url = models.URLField(blank=True)
    loan_type = models.CharField(max_length=60, default="Personal")
    principal_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    outstanding_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    next_emi_date = models.DateField(null=True, blank=True)
    interest_rate_pa = models.DecimalField(max_digits=5, decimal_places=2, default=10.50)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ON_TRACK)
    health_score = models.PositiveIntegerField(default=720)
    health_label = models.CharField(max_length=30, default="Good")
    risk_level = models.CharField(max_length=10, choices=RiskLevel.choices, default=RiskLevel.MEDIUM)
    risk_color = models.CharField(max_length=10, choices=RiskColor.choices, default=RiskColor.GREEN)
    risk_note = models.TextField(blank=True, default="")
    insurance_expiry = models.DateField(null=True, blank=True)
    policy_number = models.CharField(max_length=50, blank=True, default="")
    repayment_percent = models.PositiveIntegerField(default=0)
    total_paid = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    remaining_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    emi_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    cash_flow = models.JSONField(default=list, blank=True)
    timeline = models.JSONField(default=list, blank=True)
    alert_text = models.TextField(blank=True, default="")

    def __str__(self):
        return f"Borrower {self.user.get_full_name() or self.user.username}"

    @property
    def display_name(self):
        return self.user.get_full_name() or self.user.username

    @property
    def location(self):
        return ", ".join(part for part in [self.city, self.state] if part) or "N/A"

    @property
    def product_type(self):
        return self.occupation or "General"


class LenderProfile(TimeStampedModel):
    lender_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="lender_profile")
    institution_name = models.CharField(max_length=150)
    institution_type = models.CharField(max_length=100, blank=True)
    monthly_loan_volume = models.DecimalField(max_digits=16, decimal_places=2, default=0)
    avatar_url = models.URLField(blank=True)
    loan_range = models.CharField(max_length=50, blank=True, default="")
    interest_rate = models.CharField(max_length=50, blank=True, default="")
    approval_rate = models.CharField(max_length=20, blank=True, default="")
    speed = models.CharField(max_length=50, blank=True, default="")
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    reviews = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True, default="")

    def __str__(self):
        return self.institution_name

    @property
    def display_name(self):
        return self.institution_name


class LoanApplication(TimeStampedModel):
    class Status(models.TextChoices):
        NEW = "new", "New"
        UNDER_REVIEW = "under_review", "Under Review"
        VERIFIED = "verified", "Verified"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    application_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    borrower = models.ForeignKey(BorrowerProfile, on_delete=models.CASCADE, related_name="applications")
    preferred_lender = models.ForeignKey(
        LenderProfile,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="applications",
    )
    loan_type = models.CharField(max_length=60)
    requested_amount = models.DecimalField(max_digits=14, decimal_places=2)
    requested_tenure_months = models.PositiveIntegerField(default=12)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    ai_score = models.PositiveIntegerField(default=700)
    max_potential = models.PositiveIntegerField(default=850)
    score_change = models.CharField(max_length=50, default="+0pts from last month")
    payment_history = models.PositiveIntegerField(default=80)
    credit_utilization = models.PositiveIntegerField(default=30)
    account_age = models.CharField(max_length=50, default="1 Year")
    credit_mix = models.CharField(max_length=50, default="Good")
    risk_level = models.CharField(max_length=10, choices=BorrowerProfile.RiskLevel.choices, default=BorrowerProfile.RiskLevel.MEDIUM)
    default_probability = models.CharField(max_length=20, default="5%")
    prob_change = models.CharField(max_length=20, default="0%")
    monthly_income = models.CharField(max_length=40, default="₹0")
    debt_to_income = models.CharField(max_length=20, default="0%")
    note = models.TextField(blank=True, default="")
    activities = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"Application {self.application_id}"


class ITRProfile(TimeStampedModel):
    borrower = models.OneToOneField(BorrowerProfile, on_delete=models.CASCADE, primary_key=True)
    taxpayer_type = models.CharField(max_length=50)
    income_source = models.CharField(max_length=100)
    employer_category = models.CharField(max_length=100)
    professional_exp_years = models.IntegerField(default=0)
    gross_total_income_yr1 = models.FloatField(default=0)
    gross_total_income_yr2 = models.FloatField(default=0)
    gross_total_income_yr3 = models.FloatField(default=0)
    yoy_income_growth_rate = models.FloatField(default=0)
    income_volatility_index = models.FloatField(default=0)
    filing_delay_days = models.IntegerField(default=0)
    section_80c_total = models.FloatField(default=0)
    section_80d_premium = models.FloatField(default=0)
    has_claimed_flag = models.BooleanField(default=False)
    investment_assets_value = models.FloatField(default=0)
    is_advanced_filer_flag = models.BooleanField(default=False)
    declared_itr_ratio = models.FloatField(default=0)
    asset_to_income_ratio = models.FloatField(default=0)

    class Meta:
        db_table = "dim_itr_profile"


class GSTMonthlyFact(TimeStampedModel):
    borrower = models.ForeignKey(BorrowerProfile, on_delete=models.CASCADE, related_name="gst_monthly_facts")
    year_month = models.CharField(max_length=7)
    monthly_turnover = models.FloatField(default=0)
    tax_claimed = models.FloatField(default=0)
    tax_liability_gst = models.FloatField(default=0)
    filing_delay_days = models.IntegerField(default=0)
    nil_return_flag = models.BooleanField(default=False)
    tax_sales_ratio = models.FloatField(default=0)

    class Meta:
        db_table = "fact_gst_monthly"
        unique_together = ("borrower", "year_month")


class BankTransactionFact(TimeStampedModel):
    txn_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    borrower = models.ForeignKey(BorrowerProfile, on_delete=models.CASCADE, related_name="bank_transactions")
    txn_date = models.DateField()
    txn_amount = models.FloatField()
    txn_type = models.CharField(max_length=40)
    txn_category = models.CharField(max_length=100)
    balance_after = models.FloatField(default=0)

    class Meta:
        db_table = "fact_bank_txn"


class LoanRegisterFact(TimeStampedModel):
    loan_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    borrower = models.ForeignKey(BorrowerProfile, on_delete=models.CASCADE, related_name="loan_register_facts")
    loan_type = models.CharField(max_length=60)
    lender_category = models.CharField(max_length=100)
    original_principal = models.FloatField(default=0)
    outstanding_principal = models.FloatField(default=0)
    interest_rate_pa = models.FloatField(default=0)
    tenure_remaining_months = models.IntegerField(default=0)
    emi_amount = models.FloatField(default=0)
    security_type = models.CharField(max_length=80, blank=True)
    dpd_30_flag = models.BooleanField(default=False)
    dpd_90_flag = models.BooleanField(default=False)
    restructured_flag = models.BooleanField(default=False)

    class Meta:
        db_table = "fact_loan_register"


class BankSummaryDim(TimeStampedModel):
    borrower = models.OneToOneField(BorrowerProfile, on_delete=models.CASCADE, primary_key=True)
    avg_monthly_credit = models.FloatField(default=0)
    avg_monthly_debit = models.FloatField(default=0)
    credit_debit_ratio = models.FloatField(default=0)
    bounce_count_12m = models.IntegerField(default=0)
    overdraft_usage_flag = models.BooleanField(default=False)
    min_balance_breach_count = models.IntegerField(default=0)
    avg_emi_bounce = models.FloatField(default=0)
    actual_emi_ratio = models.FloatField(default=0)
    liquidity_score = models.FloatField(default=0)
    financial_stress_index = models.FloatField(default=0)
    cc_min_pay_only_flag = models.BooleanField(default=False)
    investment_debit_flag = models.BooleanField(default=False)
    savings_behavior_score = models.FloatField(default=0)

    class Meta:
        db_table = "dim_bank_summary"


class LoanSummaryDim(TimeStampedModel):
    borrower = models.OneToOneField(BorrowerProfile, on_delete=models.CASCADE, primary_key=True)
    total_active_loans = models.IntegerField(default=0)
    total_outstanding = models.FloatField(default=0)
    total_monthly_emi = models.FloatField(default=0)
    unsecured_debt_ratio = models.FloatField(default=0)
    collateral_coverage_ratio = models.FloatField(default=0)
    avg_dpd_90_ratio = models.FloatField(default=0)
    debt_vintage_score = models.FloatField(default=0)

    class Meta:
        db_table = "dim_loan_summary"


class DerivedSignalsDim(TimeStampedModel):
    borrower = models.OneToOneField(BorrowerProfile, on_delete=models.CASCADE, primary_key=True)
    last_1y_itr_income_gap = models.FloatField(default=0)
    actual_vs_declared_emi = models.FloatField(default=0)
    gst_itr_consistency_score = models.FloatField(default=0)
    multi_doc_anomaly_count = models.IntegerField(default=0)
    repayment_capacity_score = models.FloatField(default=0)
    financial_health_index = models.FloatField(default=0)
    document_completeness_score = models.IntegerField(default=0)
    composite_credit_score = models.FloatField(default=0)

    class Meta:
        db_table = "dim_derived_signals"


class MasterMLTrainingTable(TimeStampedModel):
    borrower = models.OneToOneField(BorrowerProfile, on_delete=models.CASCADE, primary_key=True)
    is_default = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(1)], default=0)
    income_stability_label = models.CharField(max_length=30, default="stable")
    entry_stress_flag = models.BooleanField(default=False)
    fraud_risk_score = models.FloatField(default=0)
    recommended_loan_band = models.CharField(max_length=30, default="standard")

    class Meta:
        db_table = "master_ml_training_table"


class BorrowerDocument(TimeStampedModel):
    DOCUMENT_TYPES = [
        ("bank_statement", "Bank Statement"),
        ("gst", "GST Records"),
        ("itr", "ITR Records"),
        ("upi", "UPI History"),
        ("other", "Other Document"),
    ]
    STATUS_CHOICES = [
        ("processing", "Processing"),
        ("under_review", "Under Review"),
        ("verified", "Verified"),
        ("flagged", "Flagged"),
    ]

    borrower = models.ForeignKey(BorrowerProfile, on_delete=models.CASCADE, related_name="documents")
    file = models.FileField(upload_to="documents/%Y/%m/")
    document_type = models.CharField(max_length=30, choices=DOCUMENT_TYPES, default="bank_statement")
    file_name = models.CharField(max_length=255)
    file_size = models.CharField(max_length=50, default="Unknown")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="processing")

    class Meta:
        db_table = "borrower_documents"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.borrower.name} - {self.file_name} ({self.document_type})"

