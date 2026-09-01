from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from api.models import BorrowerProfile, LenderProfile, LoanApplication, User


class FinPulseAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create Demo Borrower User & Profile
        self.borrower_user = User.objects.create_user(
            username="test_borrower",
            email="borrower@test.com",
            password="password123",
            role=User.Role.BORROWER,
        )
        self.borrower_profile = BorrowerProfile.objects.create(
            user=self.borrower_user,
            phone_number="+1 555 111 2222",
            city="Austin",
            state="TX",
            occupation="Engineer",
            health_score=720,
            health_label="Good",
        )

        # Create Demo Lender User & Profile
        self.lender_user = User.objects.create_user(
            username="test_lender",
            email="lender@test.com",
            password="password123",
            role=User.Role.LENDER,
        )
        self.lender_profile = LenderProfile.objects.create(
            user=self.lender_user,
            institution_name="Test Bank",
            institution_type="Digital Bank",
        )

        # Create Loan Application
        self.application = LoanApplication.objects.create(
            borrower=self.borrower_profile,
            preferred_lender=self.lender_profile,
            loan_type="Personal Loan",
            requested_amount=15000,
            requested_tenure_months=24,
            status=LoanApplication.Status.UNDER_REVIEW,
        )

    def test_health_check(self):
        response = self.client.get("/api/v1/health/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("status"), "ok")

    def test_borrower_registration(self):
        response = self.client.post(
            "/api/v1/auth/register/borrower/",
            {
                "username": "new_borrower_123",
                "email": "new_borrower@test.com",
                "password": "password123",
                "first_name": "New",
                "last_name": "User",
                "phone_number": "555123456",
                "city": "Dallas",
                "state": "TX",
                "occupation": "Developer",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("token", response.data)

    def test_login(self):
        response = self.client.post(
            "/api/v1/auth/login/",
            {"username_or_email": "borrower@test.com", "password": "password123"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)

    def test_list_borrowers(self):
        response = self.client.get("/api/v1/borrowers/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)

    def test_list_lenders(self):
        response = self.client.get("/api/v1/lenders/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)

    def test_list_applications(self):
        self.client.force_authenticate(user=self.lender_user)
        response = self.client.get("/api/v1/applications/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)

    def test_patch_application_status(self):
        self.client.force_authenticate(user=self.lender_user)
        app_id = self.application.application_id
        response = self.client.patch(
            f"/api/v1/applications/{app_id}/",
            {"status": "approved", "note": "Approved by underwriter"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.application.refresh_from_db()
        self.assertEqual(self.application.status, "approved")

    def test_ml_health_score_endpoint(self):
        response = self.client.post(
            "/api/v1/predict/health-score/",
            {
                "features": {
                    "monthly_income": 60000,
                    "total_expense": 25000,
                    "savings_rate": 0.3,
                    "emi_income_ratio": 0.2,
                    "cashflow_volatility": 0.1,
                }
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("health_score", response.data)
        self.assertIn("risk_label", response.data)

    def test_ml_default_risk_endpoint(self):
        response = self.client.post(
            "/api/v1/predict/default-risk/",
            {
                "features": {
                    "health_score": 75.0,
                    "missed_emi": 0,
                    "income_variance": 0.1,
                    "active_loans": 1,
                }
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("default_probability", response.data)
        self.assertIn("risk_class", response.data)

    def test_document_upload_and_delete(self):
        from django.core.files.uploadedfile import SimpleUploadedFile
        self.client.force_authenticate(user=self.borrower_user)
        test_file = SimpleUploadedFile("bank_stmt.pdf", b"dummy file content", content_type="application/pdf")
        
        # 1. Upload Document
        response = self.client.post(
            "/api/v1/documents/",
            {"file": test_file, "document_type": "bank_statement"},
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["file_name"], "bank_stmt.pdf")
        self.assertEqual(response.data["document_type"], "bank_statement")
        self.assertEqual(response.data["status"], "processing")
        doc_id = response.data["id"]

        # 2. List Documents
        list_resp = self.client.get("/api/v1/documents/")
        self.assertEqual(list_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_resp.data), 1)

        # 3. Delete Document
        del_resp = self.client.delete(f"/api/v1/documents/{doc_id}/")
        self.assertEqual(del_resp.status_code, status.HTTP_204_NO_CONTENT)

        # 4. List Documents should be empty
        list_resp2 = self.client.get("/api/v1/documents/")
        self.assertEqual(len(list_resp2.data), 0)

