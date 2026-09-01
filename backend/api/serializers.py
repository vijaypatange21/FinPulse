from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import BorrowerDocument, BorrowerProfile, LenderProfile, LoanApplication, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "role"]


class UserReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "role"]


class BorrowerSnapshotSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="borrower_id", read_only=True)
    name = serializers.CharField(source="display_name", read_only=True)
    location = serializers.CharField(read_only=True)
    productType = serializers.CharField(source="product_type", read_only=True)
    principal = serializers.SerializerMethodField()
    outstanding = serializers.SerializerMethodField()
    nextEmi = serializers.SerializerMethodField()
    status = serializers.CharField(read_only=True)
    riskScore = serializers.IntegerField(source="health_score", read_only=True)
    avatarUrl = serializers.CharField(source="avatar_url", read_only=True)
    healthScore = serializers.IntegerField(source="health_score", read_only=True)
    healthLabel = serializers.CharField(source="health_label", read_only=True)
    memberSince = serializers.SerializerMethodField()
    totalOutstanding = serializers.SerializerMethodField()
    nextEmiDate = serializers.SerializerMethodField()
    interestRate = serializers.SerializerMethodField()
    riskLevel = serializers.CharField(source="risk_level", read_only=True)
    riskColor = serializers.CharField(source="risk_color", read_only=True)
    riskNote = serializers.CharField(source="risk_note", read_only=True)
    insuranceExpiry = serializers.SerializerMethodField()
    policyNumber = serializers.CharField(source="policy_number", read_only=True)
    repaymentPercent = serializers.IntegerField(source="repayment_percent", read_only=True)
    totalPaid = serializers.SerializerMethodField()
    remaining = serializers.SerializerMethodField()
    emiAmount = serializers.SerializerMethodField()
    cashFlow = serializers.JSONField(source="cash_flow", read_only=True)
    timeline = serializers.JSONField(read_only=True)

    recentTransactions = serializers.SerializerMethodField()
    alertText = serializers.CharField(source="alert_text", read_only=True)

    currentLoanType = serializers.CharField(source="loan_type", read_only=True)
    currentStatus = serializers.CharField(source="status", read_only=True)


    class Meta:
        model = BorrowerProfile
        fields = [
            "id",
            "borrower_id",
            "user",
            "name",
            "location",
            "productType",
            "principal",
            "outstanding",
            "nextEmi",
            "status",
            "riskScore",
            "avatarUrl",
            "healthScore",
            "healthLabel",
            "memberSince",
            "totalOutstanding",
            "nextEmiDate",
            "interestRate",
            "riskLevel",
            "riskColor",
            "riskNote",
            "insuranceExpiry",
            "policyNumber",
            "repaymentPercent",
            "totalPaid",
            "remaining",
            "emiAmount",
            "cashFlow",
            "timeline",
            "recentTransactions",
            "alertText",
            "currentLoanType",
            "currentStatus",
            "phone_number",
            "city",
            "state",
            "occupation",
            "created_at",
            "updated_at",
        ]

    def get_recentTransactions(self, obj):
        txns = obj.bank_transactions.all().order_by("-txn_date")[:50]
        return [
            {
                "id": str(t.txn_id),
                "date": t.txn_date.strftime("%d %b %Y"),
                "description": t.txn_category or "Banking Transaction",
                "category": t.txn_category,
                "amount": t.txn_amount,
                "type": t.txn_type,
                "balance": t.balance_after,
                "status": "Completed",
            }
            for t in txns
        ]


    def get_principal(self, obj):
        return obj.principal_amount

    def get_outstanding(self, obj):
        return obj.outstanding_amount

    def get_nextEmi(self, obj):
        return obj.next_emi_date

    def get_memberSince(self, obj):
        return obj.created_at.date() if obj.created_at else None

    def get_totalOutstanding(self, obj):
        return obj.outstanding_amount

    def get_nextEmiDate(self, obj):
        return obj.next_emi_date

    def get_interestRate(self, obj):
        return f"{obj.interest_rate_pa}% p.a."

    def get_insuranceExpiry(self, obj):
        return obj.insurance_expiry

    def get_totalPaid(self, obj):
        return obj.total_paid

    def get_remaining(self, obj):
        return obj.remaining_amount

    def get_emiAmount(self, obj):
        return obj.emi_amount


class LenderSnapshotSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="lender_id", read_only=True)
    name = serializers.CharField(source="display_name", read_only=True)
    type = serializers.CharField(source="institution_type", read_only=True)
    loanRange = serializers.SerializerMethodField()
    interestRate = serializers.SerializerMethodField()
    approvalRate = serializers.CharField(source="approval_rate", read_only=True)
    speed = serializers.CharField(read_only=True)
    rating = serializers.DecimalField(max_digits=3, decimal_places=1, read_only=True)
    reviews = serializers.IntegerField(read_only=True)
    avatarUrl = serializers.CharField(source="avatar_url", read_only=True)

    def get_loanRange(self, obj):
        val = obj.loan_range or "₹1L - ₹50L"
        return val.replace("$", "₹")

    def get_interestRate(self, obj):
        val = obj.interest_rate or "Starting 9.5% p.a."
        return val.replace("$", "₹")

    class Meta:
        model = LenderProfile
        fields = [
            "id",
            "lender_id",
            "user",
            "name",
            "type",
            "loanRange",
            "interestRate",
            "approvalRate",
            "speed",
            "rating",
            "reviews",
            "avatarUrl",
            "institution_name",
            "institution_type",
            "monthly_loan_volume",
            "description",
            "created_at",
            "updated_at",
        ]


class LoanApplicationSnapshotSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="application_id", read_only=True)
    borrowerId = serializers.SerializerMethodField()
    borrowerName = serializers.SerializerMethodField()
    loanType = serializers.CharField(source="loan_type", read_only=True)
    amount = serializers.SerializerMethodField()
    aiScore = serializers.IntegerField(source="ai_score", read_only=True)
    appliedDate = serializers.DateTimeField(source="created_at", read_only=True)
    status = serializers.CharField(required=False)
    avatarUrl = serializers.SerializerMethodField()
    occupation = serializers.CharField(source="loan_type", read_only=True)
    name = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    tenure = serializers.SerializerMethodField()
    maxPotential = serializers.IntegerField(source="max_potential", read_only=True)
    scoreChange = serializers.CharField(source="score_change", read_only=True)
    paymentHistory = serializers.IntegerField(source="payment_history", read_only=True)
    creditUtilization = serializers.IntegerField(source="credit_utilization", read_only=True)
    accountAge = serializers.CharField(source="account_age", read_only=True)
    creditMix = serializers.CharField(source="credit_mix", read_only=True)
    riskLevel = serializers.CharField(source="risk_level", read_only=True)
    defaultProbability = serializers.CharField(source="default_probability", read_only=True)
    probChange = serializers.CharField(source="prob_change", read_only=True)
    monthlyIncome = serializers.CharField(source="monthly_income", read_only=True)
    debtToIncome = serializers.CharField(source="debt_to_income", read_only=True)
    note = serializers.CharField(read_only=True)
    activities = serializers.JSONField(read_only=True)

    class Meta:
        model = LoanApplication
        fields = [
            "id",
            "application_id",
            "borrower",
            "preferred_lender",
            "borrowerId",
            "borrowerName",
            "loanType",
            "amount",
            "aiScore",
            "appliedDate",
            "status",
            "avatarUrl",
            "occupation",
            "name",
            "location",
            "tenure",
            "requested_amount",
            "requested_tenure_months",
            "maxPotential",
            "scoreChange",
            "paymentHistory",
            "creditUtilization",
            "accountAge",
            "creditMix",
            "riskLevel",
            "defaultProbability",
            "probChange",
            "monthlyIncome",
            "debtToIncome",
            "note",
            "activities",
            "created_at",
            "updated_at",
        ]

    def get_borrowerId(self, obj):
        return obj.borrower.borrower_id

    def get_borrowerName(self, obj):
        return obj.borrower.display_name

    def get_amount(self, obj):
        return obj.requested_amount

    def get_avatarUrl(self, obj):
        return obj.borrower.avatar_url

    def get_name(self, obj):
        return obj.borrower.display_name

    def get_location(self, obj):
        return obj.borrower.location

    def get_tenure(self, obj):
        return f"{obj.requested_tenure_months} Months"
class BorrowerRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    phone_number = serializers.CharField(max_length=20, required=False, allow_blank=True)
    city = serializers.CharField(max_length=100, required=False, allow_blank=True)
    state = serializers.CharField(max_length=100, required=False, allow_blank=True)
    occupation = serializers.CharField(max_length=120, required=False, allow_blank=True)

    def create(self, validated_data):
        profile_data = {
            "phone_number": validated_data.pop("phone_number", ""),
            "city": validated_data.pop("city", ""),
            "state": validated_data.pop("state", ""),
            "occupation": validated_data.pop("occupation", ""),
        }
        user = User.objects.create_user(role=User.Role.BORROWER, **validated_data)
        BorrowerProfile.objects.create(
            user=user,
            loan_type="None",
            principal_amount=0,
            outstanding_amount=0,
            status=BorrowerProfile.Status.ON_TRACK,
            health_score=0,
            health_label="New Profile",
            risk_level=BorrowerProfile.RiskLevel.LOW,
            risk_color=BorrowerProfile.RiskColor.GREEN,
            repayment_percent=0,
            **profile_data,
        )
        return user


class LenderRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    institution_name = serializers.CharField(max_length=150)
    institution_type = serializers.CharField(max_length=100, required=False, allow_blank=True)
    monthly_loan_volume = serializers.DecimalField(max_digits=16, decimal_places=2, default=0)

    def create(self, validated_data):
        profile_data = {
            "institution_name": validated_data.pop("institution_name"),
            "institution_type": validated_data.pop("institution_type", ""),
            "monthly_loan_volume": validated_data.pop("monthly_loan_volume", 0),
        }
        user = User.objects.create_user(role=User.Role.LENDER, **validated_data)
        LenderProfile.objects.create(
            user=user,
            approval_rate="90%",
            loan_range="₹10K - ₹50L",
            interest_rate="Starting 11% p.a.",
            speed="3 Days",
            rating=4.5,
            reviews=0,
            **profile_data,
        )
        return user


class LoginSerializer(serializers.Serializer):
    username_or_email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username_or_email = attrs.get("username_or_email")
        password = attrs.get("password")

        lookup = {"username": username_or_email}
        if "@" in username_or_email:
            lookup = {"email": username_or_email}

        user_obj = User.objects.filter(**lookup).first()
        if not user_obj:
            raise serializers.ValidationError("Invalid credentials.")

        user = authenticate(username=user_obj.username, password=password)
        if not user:
            raise serializers.ValidationError("Invalid credentials.")

        attrs["user"] = user
        return attrs


class BorrowerProfileSerializer(BorrowerSnapshotSerializer):
    user = UserReferenceSerializer(read_only=True)


class LenderProfileSerializer(LenderSnapshotSerializer):
    user = UserReferenceSerializer(read_only=True)


class LoanApplicationSerializer(LoanApplicationSnapshotSerializer):
    borrower = serializers.PrimaryKeyRelatedField(queryset=BorrowerProfile.objects.all())
    preferred_lender = serializers.PrimaryKeyRelatedField(
        queryset=LenderProfile.objects.all(),
        required=False,
        allow_null=True,
    )


class BorrowerDocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = BorrowerDocument
        fields = [
            "id",
            "borrower",
            "file",
            "file_url",
            "document_type",
            "file_name",
            "file_size",
            "status",
            "parsed_data",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "borrower", "file_name", "file_size", "file_url", "parsed_data", "created_at", "updated_at"]


    def get_file_url(self, obj):
        if not obj.file:
            return None
        request = self.context.get("request")
        if request is not None:
            return request.build_absolute_uri(obj.file.url)
        return obj.file.url

