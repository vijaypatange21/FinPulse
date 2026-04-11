import random
from django.contrib.auth import get_user_model
from api.models import BorrowerProfile, LenderProfile, LoanApplication  # adjust "core" if needed

User = get_user_model()

# Clear old data (optional)
LoanApplication.objects.all().delete()
BorrowerProfile.objects.all().delete()
LenderProfile.objects.all().delete()
User.objects.all().delete()

borrowers = []
lenders = []

# Create Borrowers (25)
for i in range(25):
    user = User.objects.create_user(
        username=f"borrower{i}",
        email=f"borrower{i}@example.com",
        password="Test1234",
        role=User.Role.BORROWER
    )
    profile = BorrowerProfile.objects.create(
        user=user,
        phone_number=str(random.randint(9000000000, 9999999999)),
        city=random.choice(["Vadodara", "Ahmedabad", "Surat"]),
        state="Gujarat",
        occupation=random.choice(["Engineer", "Teacher", "Doctor"])
    )
    borrowers.append(profile)

# Create Lenders (10)
for i in range(10):
    user = User.objects.create_user(
        username=f"lender{i}",
        email=f"lender{i}@example.com",
        password="Test1234",
        role=User.Role.LENDER
    )
    profile = LenderProfile.objects.create(
        user=user,
        institution_name=f"FinanceCorp{i}",
        institution_type=random.choice(["NBFC", "Bank"]),
        monthly_loan_volume=random.randint(100000, 10000000)
    )
    lenders.append(profile)

# Create Loan Applications (50)
for i in range(50):
    LoanApplication.objects.create(
        borrower=random.choice(borrowers),
        preferred_lender=random.choice(lenders),
        loan_type=random.choice(["personal", "home", "auto"]),
        requested_amount=random.randint(50000, 1000000),
        requested_tenure_months=random.choice([12, 24, 36, 60]),
        status=random.choice(["pending", "approved", "rejected"])
    )

print("✅ 50 Loan Applications + Users Created Successfully!")