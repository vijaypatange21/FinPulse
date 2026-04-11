# FinPulse Backend (Django REST API)

This backend adds a production-style API layer for the FinPulse frontend prototype.

## What is included

- Django + Django REST Framework API project
- Role-based users (borrower, lender)
- Registration + login (token auth)
- Core entities:
  - Borrower profile
  - Lender profile
  - Loan application
- Schema-inspired analytical tables from your architecture image:
  - dim_itr_profile
  - fact_gst_monthly
  - fact_bank_txn
  - fact_loan_register
  - dim_bank_summary
  - dim_loan_summary
  - dim_derived_signals
  - master_ml_training_table
- 5 ML endpoints with dummy model fallback logic
- 5 dummy PKL placeholders in api/dummy_models
- Celery + Redis async queue for high-concurrency background processing

## Quick start

1. Create and activate a virtual environment.
2. Install dependencies:

   pip install -r requirements.txt

3. Create environment file:

   cp .env.example .env

4. Run migrations:

   python manage.py makemigrations
   python manage.py migrate

5. Start server:

   python manage.py runserver

6. Start Celery worker (new terminal):

  celery -A finpulse_backend worker -l info

Base URL: http://127.0.0.1:8000

## API routes

### Health

- GET /api/v1/health/

### Auth

- POST /api/v1/auth/register/borrower/
- POST /api/v1/auth/register/lender/
- POST /api/v1/auth/login/

### Core resources

- GET /api/v1/borrowers/
- GET /api/v1/borrowers/{borrower_id}/
- GET /api/v1/lenders/
- GET /api/v1/lenders/{lender_id}/
- GET/POST /api/v1/applications/
- GET/PATCH/DELETE /api/v1/applications/{application_id}/

### Async queue routes

- GET /api/v1/queue/tasks/{task_id}/
- POST /api/v1/queue/applications/{application_id}/process/
- POST /api/v1/queue/borrowers/{borrower_id}/refresh/
- POST /api/v1/queue/lenders/{lender_id}/overview/

### ML endpoints

- POST /api/v1/predict/health-score/
- POST /api/v1/predict/default-risk/
- POST /api/v1/detect/anomaly/
- POST /api/v1/forecast/balance/
- POST /api/v1/recommend/wellness/

## Example payloads

### Health score

POST /api/v1/predict/health-score/

{
  "user_id": "e7213175-fd7e-4f3a-85e9-9f0b2e5539d4",
  "features": {
    "monthly_income": 50000,
    "total_expense": 30000,
    "savings_rate": 0.2,
    "emi_income_ratio": 0.25,
    "cashflow_volatility": 0.15
  }
}

### Default risk

POST /api/v1/predict/default-risk/

{
  "user_id": "e7213175-fd7e-4f3a-85e9-9f0b2e5539d4",
  "features": {
    "health_score": 78.3,
    "missed_emi": 0,
    "income_variance": 0.2,
    "active_loans": 2
  }
}

### Anomaly

POST /api/v1/detect/anomaly/

{
  "user_id": "e7213175-fd7e-4f3a-85e9-9f0b2e5539d4",
  "transaction": {
    "amount": 12000,
    "recent_amounts": [1000, 1200, 900, 1500]
  }
}

### Forecast

POST /api/v1/forecast/balance/

{
  "user_id": "e7213175-fd7e-4f3a-85e9-9f0b2e5539d4",
  "balance_history": [45000, 46000, 47000, 46500, 48000]
}

### Wellness

POST /api/v1/recommend/wellness/

{
  "user_id": "e7213175-fd7e-4f3a-85e9-9f0b2e5539d4",
  "features": {
    "savings_rate": 0.12,
    "debt_income_ratio": 0.4,
    "discretionary_spending_ratio": 0.3
  }
}

## Notes on dummy PKL files

The 5 files in api/dummy_models are intentional placeholders. If a file cannot be unpickled, the backend automatically falls back to internal deterministic dummy models. This lets the APIs work now while your real trained models are still pending.

## Celery behavior in workflows

- Borrower registration enqueues a post-registration bootstrap task.
- Lender registration enqueues a post-registration bootstrap task.
- Loan application creation enqueues async processing immediately and returns background_task_id.
- Lender overview and borrower snapshot refresh are queue-first APIs for fetch-heavy dashboard workflows.
