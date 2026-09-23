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

        # Create Demo Admin User
        self.admin_user = User.objects.create_user(
            username="test_admin",
            email="admin@test.com",
            password="password123",
            role=User.Role.ADMIN,
            is_staff=True,
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
        self.client.force_authenticate(user=self.lender_user)
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

    def test_document_verification_rbac(self):
        from django.core.files.uploadedfile import SimpleUploadedFile
        from api.models import BorrowerDocument, Notification

        test_file = SimpleUploadedFile("statement.pdf", b"test statement bytes", content_type="application/pdf")
        doc = BorrowerDocument.objects.create(
            borrower=self.borrower_profile,
            file=test_file,
            file_name="statement.pdf",
            status="pending_review",
        )

        # 1. Borrower user cannot verify or reject document (403 Forbidden)
        self.client.force_authenticate(user=self.borrower_user)
        resp_borrower = self.client.post(f"/api/v1/documents/{doc.id}/verify/", {"notes": "Self verification attempt"})
        self.assertEqual(resp_borrower.status_code, status.HTTP_403_FORBIDDEN)

        resp_borrower_reject = self.client.post(f"/api/v1/documents/{doc.id}/reject/", {"reason": "Self rejection attempt"})
        self.assertEqual(resp_borrower_reject.status_code, status.HTTP_403_FORBIDDEN)

        # 2. STRICT SECURITY: Lender user CANNOT verify or reject document (403 Forbidden)
        self.client.force_authenticate(user=self.lender_user)
        resp_lender_verify = self.client.post(f"/api/v1/documents/{doc.id}/verify/", {"notes": "Lender attempt to verify"})
        self.assertEqual(resp_lender_verify.status_code, status.HTTP_403_FORBIDDEN)

        resp_lender_reject = self.client.post(f"/api/v1/documents/{doc.id}/reject/", {"reason": "Lender attempt to reject"})
        self.assertEqual(resp_lender_reject.status_code, status.HTTP_403_FORBIDDEN)

        # 3. ONLY Admin user CAN verify document (200 OK)
        self.client.force_authenticate(user=self.admin_user)
        resp_admin = self.client.post(f"/api/v1/documents/{doc.id}/verify/", {"notes": "Approved by platform compliance admin"})
        self.assertEqual(resp_admin.status_code, status.HTTP_200_OK)
        doc.refresh_from_db()
        self.assertEqual(doc.status, "verified")
        self.assertEqual(doc.verified_by, self.admin_user)

        # 4. Check that real-time notification was created for Borrower
        borrower_notif = Notification.objects.filter(recipient=self.borrower_user).first()
        self.assertIsNotNone(borrower_notif)
        self.assertIn("Verified", borrower_notif.title)

    def test_lender_compliance_and_notifications(self):
        from django.core.files.uploadedfile import SimpleUploadedFile
        from api.models import LenderDocument, LenderProfile, Notification

        test_file = SimpleUploadedFile("nbfc_cert.pdf", b"license cert bytes", content_type="application/pdf")

        # 1. Lender uploads compliance document
        self.client.force_authenticate(user=self.lender_user)
        resp = self.client.post(
            "/api/v1/lender-documents/",
            {"file": test_file, "document_type": "nbfc_license"},
            format="multipart",
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        doc_id = resp.data["id"]

        # 2. Lender cannot self-verify compliance document
        resp_self_verify = self.client.post(f"/api/v1/lender-documents/{doc_id}/verify/")
        self.assertEqual(resp_self_verify.status_code, status.HTTP_403_FORBIDDEN)

        # 3. Admin verifies institutional compliance document
        self.client.force_authenticate(user=self.admin_user)
        resp_admin_verify = self.client.post(f"/api/v1/lender-documents/{doc_id}/verify/", {"notes": "RBI registration confirmed"})
        self.assertEqual(resp_admin_verify.status_code, status.HTTP_200_OK)

        self.lender_profile.refresh_from_db()
        self.assertEqual(self.lender_profile.verification_status, LenderProfile.VerificationStatus.VERIFIED)

        # 4. Lender checks notifications endpoint
        self.client.force_authenticate(user=self.lender_user)
        notif_resp = self.client.get("/api/v1/notifications/")
        self.assertEqual(notif_resp.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(notif_resp.data), 1)

        notif_id = notif_resp.data[0]["notification_id"]
        # Mark read
        read_resp = self.client.post(f"/api/v1/notifications/{notif_id}/read/")
        self.assertEqual(read_resp.status_code, status.HTTP_200_OK)

    def test_admin_dashboard_stats_and_user_management(self):
        # 1. Borrower cannot access admin stats
        self.client.force_authenticate(user=self.borrower_user)
        resp_forbidden = self.client.get("/api/v1/admin/stats/")
        self.assertEqual(resp_forbidden.status_code, status.HTTP_403_FORBIDDEN)

        # 2. Admin can access admin stats
        self.client.force_authenticate(user=self.admin_user)
        resp_stats = self.client.get("/api/v1/admin/stats/")
        self.assertEqual(resp_stats.status_code, status.HTTP_200_OK)
        self.assertIn("kpis", resp_stats.data)
        self.assertIn("total_borrowers", resp_stats.data["kpis"])
        self.assertIn("system_health", resp_stats.data)

        # 3. Admin can list users
        resp_users = self.client.get("/api/v1/admin/users/")
        self.assertEqual(resp_users.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(resp_users.data["users"]), 3)


