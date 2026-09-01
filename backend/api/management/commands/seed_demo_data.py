from datetime import date
from django.core.management.base import BaseCommand
from django.db import transaction

from api.ml.service import MLModelService
from api.models import BorrowerProfile, LenderProfile, LoanApplication, User


class Command(BaseCommand):
    help = "Seed database with realistic demo borrowers, lenders, applications, and ML predictions."

    def handle(self, *args, **options):
        self.stdout.write("Seeding FinPulse demo data...")
        ml_service = MLModelService()

        with transaction.atomic():
            # 1. Create Borrower Demo Users & Profiles
            borrowers_data = [
                {
                    "username": "borrower0",
                    "email": "borrower0@example.com",
                    "first_name": "Sarah",
                    "last_name": "Jenkins",
                    "phone": "+1 (555) 234-5678",
                    "city": "Austin",
                    "state": "TX",
                    "occupation": "Software Engineer",
                    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                    "loan_type": "Personal Loan",
                    "principal": 25000,
                    "outstanding": 18500,
                    "next_emi_date": date(2026, 9, 15),
                    "interest_rate": 10.5,
                    "status": BorrowerProfile.Status.ON_TRACK,
                    "monthly_income": 85000,
                    "total_expense": 35000,
                    "savings_rate": 0.35,
                    "emi_income_ratio": 0.18,
                    "cashflow_volatility": 0.08,
                    "missed_emi": 0,
                    "repayment_percent": 26,
                    "total_paid": 6500,
                    "remaining": 18500,
                    "emi_amount": 750,
                    "timeline": [
                        {"date": "2026-06-15", "amount": "$750", "status": "Paid", "type": "EMI"},
                        {"date": "2026-07-15", "amount": "$750", "status": "Paid", "type": "EMI"},
                        {"date": "2026-08-15", "amount": "$750", "status": "Paid", "type": "EMI"},
                        {"date": "2026-09-15", "amount": "$750", "status": "Upcoming", "type": "EMI"},
                    ],
                },
                {
                    "username": "borrower_demo",
                    "email": "borrower@demo.com",
                    "first_name": "Alex",
                    "last_name": "Morgan",
                    "phone": "+1 (555) 876-5432",
                    "city": "San Francisco",
                    "state": "CA",
                    "occupation": "Product Designer",
                    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                    "loan_type": "Home Renovation",
                    "principal": 40000,
                    "outstanding": 32000,
                    "next_emi_date": date(2026, 9, 20),
                    "interest_rate": 9.8,
                    "status": BorrowerProfile.Status.ON_TRACK,
                    "monthly_income": 95000,
                    "total_expense": 42000,
                    "savings_rate": 0.28,
                    "emi_income_ratio": 0.22,
                    "cashflow_volatility": 0.10,
                    "missed_emi": 0,
                    "repayment_percent": 20,
                    "total_paid": 8000,
                    "remaining": 32000,
                    "emi_amount": 1200,
                    "timeline": [
                        {"date": "2026-07-20", "amount": "$1200", "status": "Paid", "type": "EMI"},
                        {"date": "2026-08-20", "amount": "$1200", "status": "Paid", "type": "EMI"},
                        {"date": "2026-09-20", "amount": "$1200", "status": "Upcoming", "type": "EMI"},
                    ],
                },
                {
                    "username": "david_kim",
                    "email": "david.kim@example.com",
                    "first_name": "David",
                    "last_name": "Kim",
                    "phone": "+1 (555) 345-6789",
                    "city": "Seattle",
                    "state": "WA",
                    "occupation": "Data Analyst",
                    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                    "loan_type": "Auto Loan",
                    "principal": 18000,
                    "outstanding": 14200,
                    "next_emi_date": date(2026, 9, 10),
                    "interest_rate": 11.2,
                    "status": BorrowerProfile.Status.GRACE_PERIOD,
                    "monthly_income": 52000,
                    "total_expense": 38000,
                    "savings_rate": 0.10,
                    "emi_income_ratio": 0.38,
                    "cashflow_volatility": 0.25,
                    "missed_emi": 1,
                    "repayment_percent": 21,
                    "total_paid": 3800,
                    "remaining": 14200,
                    "emi_amount": 550,
                    "timeline": [
                        {"date": "2026-07-10", "amount": "$550", "status": "Paid", "type": "EMI"},
                        {"date": "2026-08-10", "amount": "$550", "status": "Grace Period", "type": "EMI"},
                        {"date": "2026-09-10", "amount": "$550", "status": "Upcoming", "type": "EMI"},
                    ],
                },
                {
                    "username": "priya_sharma",
                    "email": "priya.sharma@example.com",
                    "first_name": "Priya",
                    "last_name": "Sharma",
                    "phone": "+1 (555) 456-7890",
                    "city": "Chicago",
                    "state": "IL",
                    "occupation": "Marketing Director",
                    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
                    "loan_type": "Business Expansion",
                    "principal": 60000,
                    "outstanding": 51000,
                    "next_emi_date": date(2026, 9, 25),
                    "interest_rate": 12.0,
                    "status": BorrowerProfile.Status.OVERDUE,
                    "monthly_income": 45000,
                    "total_expense": 42000,
                    "savings_rate": 0.04,
                    "emi_income_ratio": 0.52,
                    "cashflow_volatility": 0.45,
                    "missed_emi": 2,
                    "repayment_percent": 15,
                    "total_paid": 9000,
                    "remaining": 51000,
                    "emi_amount": 1800,
                    "timeline": [
                        {"date": "2026-07-25", "amount": "$1800", "status": "Overdue", "type": "EMI"},
                        {"date": "2026-08-25", "amount": "$1800", "status": "Overdue", "type": "EMI"},
                        {"date": "2026-09-25", "amount": "$1800", "status": "Upcoming", "type": "EMI"},
                    ],
                },
                {
                    "username": "marcus_vance",
                    "email": "marcus.vance@example.com",
                    "first_name": "Marcus",
                    "last_name": "Vance",
                    "phone": "+1 (555) 567-8901",
                    "city": "Denver",
                    "state": "CO",
                    "occupation": "Financial Advisor",
                    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
                    "loan_type": "Education Loan",
                    "principal": 30000,
                    "outstanding": 21000,
                    "next_emi_date": date(2026, 9, 12),
                    "interest_rate": 8.5,
                    "status": BorrowerProfile.Status.ON_TRACK,
                    "monthly_income": 110000,
                    "total_expense": 40000,
                    "savings_rate": 0.40,
                    "emi_income_ratio": 0.15,
                    "cashflow_volatility": 0.05,
                    "missed_emi": 0,
                    "repayment_percent": 30,
                    "total_paid": 9000,
                    "remaining": 21000,
                    "emi_amount": 620,
                    "timeline": [
                        {"date": "2026-06-12", "amount": "$620", "status": "Paid", "type": "EMI"},
                        {"date": "2026-07-12", "amount": "$620", "status": "Paid", "type": "EMI"},
                        {"date": "2026-08-12", "amount": "$620", "status": "Paid", "type": "EMI"},
                    ],
                },
            ]

            seeded_borrower_profiles = []
            for b in borrowers_data:
                user, _ = User.objects.get_or_create(
                    username=b["username"],
                    defaults={
                        "email": b["email"],
                        "first_name": b["first_name"],
                        "last_name": b["last_name"],
                        "role": User.Role.BORROWER,
                    },
                )
                user.set_password("Test1234" if b["username"] == "borrower0" else "password123")
                user.save()

                # Calculate ML Health Score & Risk Level
                health_pred = ml_service.predict_health_score(
                    {
                        "features": {
                            "monthly_income": b["monthly_income"],
                            "total_expense": b["total_expense"],
                            "savings_rate": b["savings_rate"],
                            "emi_income_ratio": b["emi_income_ratio"],
                            "cashflow_volatility": b["cashflow_volatility"],
                        }
                    }
                )
                score = int(health_pred["health_score"] * 7.5 + 100)  # Map 0-100 to credit score range ~600-850
                score = max(550, min(850, score))
                risk_label = health_pred["risk_label"]

                if risk_label == "Low":
                    risk_level = BorrowerProfile.RiskLevel.LOW
                    risk_color = BorrowerProfile.RiskColor.GREEN
                    alert_text = "Income and cash flow stability are strong."
                elif risk_label == "Medium":
                    risk_level = BorrowerProfile.RiskLevel.MEDIUM
                    risk_color = BorrowerProfile.RiskColor.YELLOW
                    alert_text = "Moderate debt-to-income ratio. Monitor upcoming EMI."
                else:
                    risk_level = BorrowerProfile.RiskLevel.HIGH
                    risk_color = BorrowerProfile.RiskColor.RED
                    alert_text = "Elevated cashflow stress and missed payments detected."

                profile, _ = BorrowerProfile.objects.update_or_create(
                    user=user,
                    defaults={
                        "phone_number": b["phone"],
                        "city": b["city"],
                        "state": b["state"],
                        "occupation": b["occupation"],
                        "avatar_url": b["avatar"],
                        "loan_type": b["loan_type"],
                        "principal_amount": b["principal"],
                        "outstanding_amount": b["outstanding"],
                        "next_emi_date": b["next_emi_date"],
                        "interest_rate_pa": b["interest_rate"],
                        "status": b["status"],
                        "health_score": score,
                        "health_label": "Excellent" if score > 780 else ("Good" if score > 680 else "Fair"),
                        "risk_level": risk_level,
                        "risk_color": risk_color,
                        "risk_note": f"ML Evaluated: {risk_label} Risk",
                        "repayment_percent": b["repayment_percent"],
                        "total_paid": b["total_paid"],
                        "remaining_amount": b["remaining"],
                        "emi_amount": b["emi_amount"],
                        "cash_flow": [
                            {"month": "May", "income": b["monthly_income"], "expenses": b["total_expense"]},
                            {"month": "Jun", "income": b["monthly_income"], "expenses": b["total_expense"] + 2000},
                            {"month": "Jul", "income": b["monthly_income"] + 3000, "expenses": b["total_expense"] - 1000},
                            {"month": "Aug", "income": b["monthly_income"], "expenses": b["total_expense"]},
                        ],
                        "timeline": b["timeline"],
                        "alert_text": alert_text,
                    },
                )
                seeded_borrower_profiles.append(profile)

            # 2. Create Lender Demo Users & Profiles
            lenders_data = [
                {
                    "username": "lender0",
                    "email": "lender0@example.com",
                    "institution_name": "Apex Capital Partners",
                    "institution_type": "Institutional Bank",
                    "monthly_volume": 5000000.0,
                    "avatar": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150",
                    "loan_range": "$10,000 - $500,000",
                    "interest_rate": "8.5% - 12.0% p.a.",
                    "approval_rate": "92%",
                    "speed": "24-48 Hours",
                    "rating": 4.8,
                    "reviews": 128,
                    "description": "Leading commercial lender specializing in personal and SME growth capital.",
                },
                {
                    "username": "lender_demo",
                    "email": "lender@demo.com",
                    "institution_name": "Horizon Fintech Credit",
                    "institution_type": "Digital NBFC",
                    "monthly_volume": 3500000.0,
                    "avatar": "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=150",
                    "loan_range": "$5,000 - $250,000",
                    "interest_rate": "9.0% - 13.5% p.a.",
                    "approval_rate": "88%",
                    "speed": "Same Day",
                    "rating": 4.6,
                    "reviews": 94,
                    "description": "AI-first digital lending partner offering instant decisions.",
                },
                {
                    "username": "vanguard_lender",
                    "email": "vanguard@example.com",
                    "institution_name": "Vanguard Credit Union",
                    "institution_type": "Credit Union",
                    "monthly_volume": 2000000.0,
                    "avatar": "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=150",
                    "loan_range": "$2,000 - $100,000",
                    "interest_rate": "7.5% - 11.0% p.a.",
                    "approval_rate": "95%",
                    "speed": "2-3 Days",
                    "rating": 4.9,
                    "reviews": 210,
                    "description": "Community-focused lending institution offering competitive rates.",
                },
            ]

            seeded_lender_profiles = []
            for l in lenders_data:
                user, _ = User.objects.get_or_create(
                    username=l["username"],
                    defaults={
                        "email": l["email"],
                        "first_name": l["institution_name"].split()[0],
                        "role": User.Role.LENDER,
                    },
                )
                user.set_password("Test1234" if l["username"] == "lender0" else "password123")
                user.save()

                lender_profile, _ = LenderProfile.objects.update_or_create(
                    user=user,
                    defaults={
                        "institution_name": l["institution_name"],
                        "institution_type": l["institution_type"],
                        "monthly_loan_volume": l["monthly_volume"],
                        "avatar_url": l["avatar"],
                        "loan_range": l["loan_range"],
                        "interest_rate": l["interest_rate"],
                        "approval_rate": l["approval_rate"],
                        "speed": l["speed"],
                        "rating": l["rating"],
                        "reviews": l["reviews"],
                        "description": l["description"],
                    },
                )
                seeded_lender_profiles.append(lender_profile)

            # 3. Create Loan Applications
            applications_data = [
                {
                    "borrower_idx": 0,
                    "lender_idx": 0,
                    "loan_type": "Personal Loan",
                    "amount": 25000,
                    "tenure": 36,
                    "status": LoanApplication.Status.UNDER_REVIEW,
                    "payment_history": 98,
                    "credit_utilization": 22,
                    "account_age": "5 Years",
                    "credit_mix": "Excellent",
                    "monthly_income": "$7,083",
                    "debt_to_income": "18%",
                    "note": "Low default probability. Stable tech income.",
                },
                {
                    "borrower_idx": 1,
                    "lender_idx": 1,
                    "loan_type": "Home Renovation",
                    "amount": 40000,
                    "tenure": 48,
                    "status": LoanApplication.Status.NEW,
                    "payment_history": 95,
                    "credit_utilization": 28,
                    "account_age": "4 Years",
                    "credit_mix": "Good",
                    "monthly_income": "$7,916",
                    "debt_to_income": "22%",
                    "note": "Strong balance history with steady savings growth.",
                },
                {
                    "borrower_idx": 2,
                    "lender_idx": 0,
                    "loan_type": "Auto Loan",
                    "amount": 18000,
                    "tenure": 24,
                    "status": LoanApplication.Status.UNDER_REVIEW,
                    "payment_history": 82,
                    "credit_utilization": 45,
                    "account_age": "2 Years",
                    "credit_mix": "Fair",
                    "monthly_income": "$4,333",
                    "debt_to_income": "38%",
                    "note": "Under review due to recent grace period on EMI.",
                },
                {
                    "borrower_idx": 3,
                    "lender_idx": 1,
                    "loan_type": "Business Expansion",
                    "amount": 60000,
                    "tenure": 60,
                    "status": LoanApplication.Status.REJECTED,
                    "payment_history": 65,
                    "credit_utilization": 68,
                    "account_age": "3 Years",
                    "credit_mix": "Fair",
                    "monthly_income": "$3,750",
                    "debt_to_income": "52%",
                    "note": "High debt-to-income ratio and multiple overdue payments.",
                },
                {
                    "borrower_idx": 4,
                    "lender_idx": 2,
                    "loan_type": "Education Loan",
                    "amount": 30000,
                    "tenure": 36,
                    "status": LoanApplication.Status.APPROVED,
                    "payment_history": 100,
                    "credit_utilization": 15,
                    "account_age": "6 Years",
                    "credit_mix": "Excellent",
                    "monthly_income": "$9,166",
                    "debt_to_income": "15%",
                    "note": "Approved based on high credit score and low risk profile.",
                },
            ]

            for app in applications_data:
                borrower = seeded_borrower_profiles[app["borrower_idx"]]
                lender = seeded_lender_profiles[app["lender_idx"]]

                # Run Default Risk Model
                risk_pred = ml_service.predict_default_risk(
                    {
                        "features": {
                            "health_score": borrower.health_score / 8.5,
                            "missed_emi": 1 if borrower.status == BorrowerProfile.Status.GRACE_PERIOD else (2 if borrower.status == BorrowerProfile.Status.OVERDUE else 0),
                            "income_variance": 0.1,
                            "active_loans": 1,
                        }
                    }
                )

                def_prob_str = f"{int(risk_pred['default_probability'] * 100)}%"
                risk_class = risk_pred["risk_class"]

                LoanApplication.objects.create(
                    borrower=borrower,
                    preferred_lender=lender,
                    loan_type=app["loan_type"],
                    requested_amount=app["amount"],
                    requested_tenure_months=app["tenure"],
                    status=app["status"],
                    ai_score=borrower.health_score,
                    max_potential=850,
                    score_change="+12pts from last month",
                    payment_history=app["payment_history"],
                    credit_utilization=app["credit_utilization"],
                    account_age=app["account_age"],
                    credit_mix=app["credit_mix"],
                    risk_level=borrower.risk_level,
                    default_probability=def_prob_str,
                    prob_change="-2%",
                    monthly_income=app["monthly_income"],
                    debt_to_income=app["debt_to_income"],
                    note=app["note"],
                    activities=[
                        {"date": "2026-08-28", "title": "Application Submitted", "description": "Form completed with verified documents."},
                        {"date": "2026-08-29", "title": "ML Risk Scoring Complete", "description": f"Assigned Default Probability: {def_prob_str} ({risk_class})."},
                        {"date": "2026-08-30", "title": "Lender Review", "description": f"Under evaluation by {lender.institution_name}."},
                    ],
                )

        self.stdout.write(self.style.SUCCESS("Successfully seeded FinPulse database with demo data!"))
