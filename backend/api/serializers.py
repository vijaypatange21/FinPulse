from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import BorrowerProfile, LenderProfile, LoanApplication, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "role"]


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
        BorrowerProfile.objects.create(user=user, **profile_data)
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
        LenderProfile.objects.create(user=user, **profile_data)
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


class BorrowerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = BorrowerProfile
        fields = ["borrower_id", "user", "phone_number", "city", "state", "occupation", "created_at"]


class LenderProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = LenderProfile
        fields = [
            "lender_id",
            "user",
            "institution_name",
            "institution_type",
            "monthly_loan_volume",
            "created_at",
        ]


class LoanApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanApplication
        fields = [
            "application_id",
            "borrower",
            "preferred_lender",
            "loan_type",
            "requested_amount",
            "requested_tenure_months",
            "status",
            "created_at",
            "updated_at",
        ]
