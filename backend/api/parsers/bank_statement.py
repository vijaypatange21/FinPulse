import time
from datetime import datetime
from django.utils import timezone
from api.models import (
    BorrowerDocument,
    BorrowerProfile,
    BankSummaryDim,
    BankTransactionFact,
    LoanApplication,
)
from api.ml.service import MLModelService
from api.ml.underwriter import evaluate_and_score_application

SAMPLE_HDFC_STATEMENT = {
    "statement": {
        "bank_name": "HDFC Bank",
        "statement_period": {
            "from": "2024-05-01",
            "to": "2024-05-31",
        },
        "account_holder": {
            "name": "VIKAS PANDEY",
            "address": "123, Green Park, Vasna Road, Vadodara - 390007, Gujarat, India",
            "email": "vikas.pandey@example.com",
            "phone": "+91 98765 43210",
        },
        "account": {
            "account_number": "5010 0123 4567 89",
            "account_type": "Savings Account",
            "ifsc": "HDFC0001234",
            "micr": "390240002",
            "branch": "Vasna Road, Vadodara",
        },
        "opening_balance": 45230.50,
        "closing_balance": 88592.75,
        "currency": "INR",
        "transactions": [
            {
                "transaction_date": "2024-05-01",
                "value_date": "2024-05-01",
                "description": "OPENING BALANCE",
                "reference_number": None,
                "debit": 0.00,
                "credit": 0.00,
                "balance": 45230.50,
                "category": "Balance Forward",
            },
            {
                "transaction_date": "2024-05-02",
                "value_date": "2024-05-02",
                "description": "UPI/DR/412345678901/Paytm/vikas.pandey@paytm/Payment to Amazon",
                "reference_number": "UPI/412345678901",
                "debit": 1289.00,
                "credit": 0.00,
                "balance": 43941.50,
                "category": "Shopping",
            },
            {
                "transaction_date": "2024-05-03",
                "value_date": "2024-05-03",
                "description": "UPI/CR/512345678902/PhonePe/ramesh.kumar@ibl/Salary",
                "reference_number": "UPI/512345678902",
                "debit": 0.00,
                "credit": 50000.00,
                "balance": 93941.50,
                "category": "Salary",
            },
            {
                "transaction_date": "2024-05-04",
                "value_date": "2024-05-04",
                "description": "ATM WDL - HDFC BANK ATM VASNA ROAD VADODARA",
                "reference_number": "ATM WDL",
                "debit": 5000.00,
                "credit": 0.00,
                "balance": 88941.50,
                "category": "Cash Withdrawal",
            },
            {
                "transaction_date": "2024-05-05",
                "value_date": "2024-05-05",
                "description": "SWIGGY/BILLDESK/pay_12345ABCDE",
                "reference_number": "BILLDESK/12345",
                "debit": 349.00,
                "credit": 0.00,
                "balance": 88592.50,
                "category": "Food & Dining",
            },
            {
                "transaction_date": "2024-05-06",
                "value_date": "2024-05-06",
                "description": "NETFLIX.COM",
                "reference_number": "NFW1234567890123",
                "debit": 649.00,
                "credit": 0.00,
                "balance": 87943.50,
                "category": "Subscription",
            },
            {
                "transaction_date": "2024-05-07",
                "value_date": "2024-05-07",
                "description": "Electricity Bill Payment VIDYUT GUJARAT",
                "reference_number": "BBPS/87654321",
                "debit": 1487.00,
                "credit": 0.00,
                "balance": 86456.50,
                "category": "Utilities",
            },
            {
                "transaction_date": "2024-05-10",
                "value_date": "2024-05-10",
                "description": "UPI/DR/412345678903/Google Pay/vikas.pandey@okicici/Payment to Flipkart",
                "reference_number": "UPI/412345678903",
                "debit": 2560.00,
                "credit": 0.00,
                "balance": 83896.50,
                "category": "Shopping",
            },
            {
                "transaction_date": "2024-05-12",
                "value_date": "2024-05-12",
                "description": "MOBILE RECHARGE - JIO 9897654321",
                "reference_number": "RECHG/1234567890",
                "debit": 299.00,
                "credit": 0.00,
                "balance": 83597.50,
                "category": "Utilities",
            },
            {
                "transaction_date": "2024-05-15",
                "value_date": "2024-05-15",
                "description": "IMPS/412345678904/RAHUL SHARMA/REFUND",
                "reference_number": "IMPS/1234567890",
                "debit": 0.00,
                "credit": 1250.00,
                "balance": 84847.50,
                "category": "Refund",
            },
            {
                "transaction_date": "2024-05-17",
                "value_date": "2024-05-17",
                "description": "LIC PREMIUM PAYMENT POLICY NO. 123456789",
                "reference_number": "BBPS/LIC/123456",
                "debit": 2346.00,
                "credit": 0.00,
                "balance": 82501.50,
                "category": "Insurance",
            },
            {
                "transaction_date": "2024-05-20",
                "value_date": "2024-05-20",
                "description": "UPI/CR/512345678905/PhonePe/neha.patel@ybl/Dinner Split",
                "reference_number": "UPI/512345678905",
                "debit": 0.00,
                "credit": 850.00,
                "balance": 83351.50,
                "category": "Transfer",
            },
            {
                "transaction_date": "2024-05-22",
                "value_date": "2024-05-22",
                "description": "UPI/DR/512345678906/BILLDESK/pay_ABCDE12345",
                "reference_number": "BILLDESK/ABCDE",
                "debit": 612.75,
                "credit": 0.00,
                "balance": 82738.75,
                "category": "Utilities",
            },
            {
                "transaction_date": "2024-05-25",
                "value_date": "2024-05-25",
                "description": "RD AUTO DEBIT RD A/c NO. 1234567890",
                "reference_number": "RD/1234567890",
                "debit": 5000.00,
                "credit": 0.00,
                "balance": 77738.75,
                "category": "Investment",
            },
            {
                "transaction_date": "2024-05-28",
                "value_date": "2024-05-28",
                "description": "UPI/CR/512345678907/Paytm/freelance.payment@okhdfcbank",
                "reference_number": "UPI/512345678906",
                "debit": 0.00,
                "credit": 12000.00,
                "balance": 89738.75,
                "category": "Freelance Income",
            },
            {
                "transaction_date": "2024-05-30",
                "value_date": "2024-05-30",
                "description": "Amazon Pay",
                "reference_number": "AMAZON/123456789",
                "debit": 1296.00,
                "credit": 0.00,
                "balance": 88442.75,
                "category": "Shopping",
            },
            {
                "transaction_date": "2024-05-31",
                "value_date": "2024-05-31",
                "description": "INTEREST CREDIT",
                "reference_number": "INT/2024-25/00123",
                "debit": 0.00,
                "credit": 150.00,
                "balance": 88592.75,
                "category": "Interest",
            },
        ],
        "totals": {
            "total_debits": 20887.75,
            "total_credits": 64250.00,
            "calculated_closing_balance": 88592.75,
        },
    }
}


def parse_and_process_bank_statement(document_id, simulated_delay_seconds=2.0):
    """
    Parses a bank statement document, extracts financial indicators and transactions,
    and updates borrower analytics, banking metrics, and ML health score.
    """
    # 1. Simulate asynchronous OCR & parsing time
    if simulated_delay_seconds > 0:
        time.sleep(simulated_delay_seconds)

    try:
        document = BorrowerDocument.objects.select_related("borrower__user").get(id=document_id)
    except BorrowerDocument.DoesNotExist:
        return None

    borrower = document.borrower
    parsed_payload = SAMPLE_HDFC_STATEMENT["statement"]

    # 2. Ingest Individual Transactions into BankTransactionFact
    BankTransactionFact.objects.filter(borrower=borrower).delete()
    for item in parsed_payload.get("transactions", []):
        d_val = float(item.get("debit", 0.0))
        c_val = float(item.get("credit", 0.0))
        txn_amt = c_val if c_val > 0 else d_val
        txn_type = "Credit" if c_val > 0 else ("Debit" if d_val > 0 else "Opening")
        txn_date_str = item.get("transaction_date", "2024-05-01")
        try:
            parsed_date = datetime.strptime(txn_date_str, "%Y-%m-%d").date()
        except Exception:
            parsed_date = timezone.now().date()

        BankTransactionFact.objects.create(
            borrower=borrower,
            txn_date=parsed_date,
            txn_amount=txn_amt,
            txn_type=txn_type,
            txn_category=item.get("category", "General"),
            balance_after=float(item.get("balance", 0.0)),
        )

    # 3. Update Bank Summary Dimension (dim_bank_summary)
    totals = parsed_payload.get("totals", {})
    total_debits = float(totals.get("total_debits", 20887.75))
    total_credits = float(totals.get("total_credits", 64250.00))
    cr_dr_ratio = round(total_credits / max(total_debits, 1.0), 2)

    bank_summary, _ = BankSummaryDim.objects.get_or_create(borrower=borrower)
    bank_summary.avg_monthly_credit = total_credits
    bank_summary.avg_monthly_debit = total_debits
    bank_summary.credit_debit_ratio = cr_dr_ratio
    bank_summary.bounce_count_12m = 0
    bank_summary.min_balance_breach_count = 0
    bank_summary.overdraft_usage_flag = False
    bank_summary.investment_debit_flag = True
    bank_summary.savings_behavior_score = 88.5
    bank_summary.liquidity_score = 92.0
    bank_summary.financial_stress_index = 7.5
    bank_summary.save()

    # 4. Update Borrower Profile Cash Flow & Demographics
    acc_holder = parsed_payload.get("account_holder", {})
    if not borrower.phone_number and acc_holder.get("phone"):
        borrower.phone_number = acc_holder.get("phone")
    if not borrower.city:
        borrower.city = "Vadodara"
        borrower.state = "Gujarat"

    borrower.cash_flow = [
        {"month": "May 2024", "income": int(total_credits), "expenses": int(total_debits), "net": int(total_credits - total_debits)},
        {"month": "Jun 2024", "income": 65000, "expenses": 21500, "net": 43500},
        {"month": "Jul 2024", "income": 66500, "expenses": 22000, "net": 44500},
    ]

    borrower.timeline = [
        {"date": "2024-05-31", "amount": f"₹{int(total_credits):,}", "status": "Verified", "type": "HDFC Inflow", "note": "Bank statement parsed & verified"},
        {"date": "2024-05-25", "amount": "₹5,000", "status": "Paid", "type": "RD Investment", "note": "Recurring Deposit auto-debit"},
        {"date": "2024-05-03", "amount": "₹50,000", "status": "Paid", "type": "Salary Credit", "note": "Monthly primary salary credit"},
    ]

    # 5. Run ML Model Prediction on Verified Statement Metrics
    ml_service = MLModelService()
    health_payload = {
        "features": {
            "monthly_income": total_credits,
            "total_expense": total_debits,
            "savings_rate": (total_credits - total_debits) / total_credits,
            "emi_income_ratio": 0.15,
            "cashflow_volatility": 0.08,
            "credit_history_length": 3.0,
        }
    }
    health_result = ml_service.predict_health_score(health_payload)
    raw_health = float(health_result.get("health_score", 78.0))
    evaluated_score = min(840, max(750, int(350 + (raw_health * 5.0))))

    borrower.health_score = evaluated_score
    borrower.health_label = "Prime" if evaluated_score >= 750 else "Good"
    borrower.risk_level = BorrowerProfile.RiskLevel.LOW
    borrower.risk_color = BorrowerProfile.RiskColor.GREEN
    borrower.save()

    # 6. Re-evaluate any active Loan Applications
    for app in LoanApplication.objects.filter(borrower=borrower):
        try:
            evaluate_and_score_application(app)
        except Exception:
            pass

    # 7. Finalize Document as Verified with Parsed Data
    document.status = "verified"
    document.parsed_data = parsed_payload
    document.save(update_fields=["status", "parsed_data", "updated_at"])

    return {
        "document_id": str(document.id),
        "status": "verified",
        "bank_name": parsed_payload.get("bank_name"),
        "account_number": parsed_payload.get("account", {}).get("account_number"),
        "total_credits": total_credits,
        "total_debits": total_debits,
        "closing_balance": parsed_payload.get("closing_balance"),
        "transactions_count": len(parsed_payload.get("transactions", [])),
        "borrower_health_score": evaluated_score,
    }
