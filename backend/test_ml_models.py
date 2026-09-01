import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from api.ml.service import MLModelService

service = MLModelService()

print("=" * 60)
print("RUNNING COMPREHENSIVE ML MODEL TEST SUITE")
print("=" * 60)

test_failures = []

# --- 1. HEALTH SCORE MODEL TESTS ---
print("\n[1] Testing HealthScoreModel...")

scenarios_health = [
    {
        "name": "High Financial Health",
        "payload": {
            "features": {
                "monthly_income": 120000,
                "total_expense": 35000,
                "savings_rate": 0.45,
                "emi_income_ratio": 0.1,
                "cashflow_volatility": 0.05,
                "credit_history_length": 5,
            }
        },
        "expected_risk": "Low",
        "min_score": 75.0,
        "max_score": 100.0,
    },
    {
        "name": "Moderate Financial Health",
        "payload": {
            "features": {
                "monthly_income": 50000,
                "total_expense": 32000,
                "savings_rate": 0.15,
                "emi_income_ratio": 0.3,
                "cashflow_volatility": 0.2,
                "credit_history_length": 2,
            }
        },
        "expected_risk": "Medium",
        "min_score": 50.0,
        "max_score": 74.99,
    },
    {
        "name": "Distressed Financial Health",
        "payload": {
            "features": {
                "monthly_income": 25000,
                "total_expense": 28000,
                "savings_rate": -0.1,
                "emi_income_ratio": 0.65,
                "cashflow_volatility": 0.6,
                "credit_history_length": 1,
            }
        },
        "expected_risk": "High",
        "min_score": 0.0,
        "max_score": 49.99,
    },
]

for s in scenarios_health:
    res = service.predict_health_score(s["payload"])
    score = res.get("health_score")
    risk = res.get("risk_label")
    name = s["name"]
    min_s = s["min_score"]
    max_s = s["max_score"]
    exp_r = s["expected_risk"]
    print(f"  - {name}: Score={score}, RiskLabel={risk}")
    if not (min_s <= score <= max_s):
        test_failures.append(f"HealthScore {name}: Score {score} not in [{min_s}, {max_s}]")
    if risk != exp_r:
        test_failures.append(f"HealthScore {name}: RiskLabel {risk} != {exp_r}")


# --- 2. DEFAULT RISK MODEL TESTS ---
print("\n[2] Testing DefaultRiskModel...")

scenarios_risk = [
    {
        "name": "Low Risk / Safe Borrower",
        "payload": {
            "features": {
                "health_score": 85.0,
                "missed_emi": 0,
                "income_variance": 0.05,
                "active_loans": 1,
                "emi_income_ratio": 0.15,
            }
        },
        "expected_class": "Safe",
        "max_prob": 0.25,
    },
    {
        "name": "Watchlist Borrower",
        "payload": {
            "features": {
                "health_score": 55.0,
                "missed_emi": 1,
                "income_variance": 0.25,
                "active_loans": 2,
                "emi_income_ratio": 0.35,
            }
        },
        "expected_class": "Watch",
        "min_prob": 0.25,
        "max_prob": 0.60,
    },
    {
        "name": "High Risk Borrower",
        "payload": {
            "features": {
                "health_score": 30.0,
                "missed_emi": 3,
                "income_variance": 0.5,
                "active_loans": 5,
                "emi_income_ratio": 0.6,
            }
        },
        "expected_class": "High Risk",
        "min_prob": 0.60,
    },
]

for s in scenarios_risk:
    res = service.predict_default_risk(s["payload"])
    prob = res.get("default_probability")
    risk_cls = res.get("risk_class")
    name = s["name"]
    exp_c = s["expected_class"]
    print(f"  - {name}: Prob={prob}, RiskClass={risk_cls}")
    if "max_prob" in s and prob >= s["max_prob"]:
        test_failures.append(f"DefaultRisk {name}: Prob {prob} >= {s['max_prob']}")
    if "min_prob" in s and prob < s["min_prob"]:
        test_failures.append(f"DefaultRisk {name}: Prob {prob} < {s['min_prob']}")
    if risk_cls != exp_c:
        test_failures.append(f"DefaultRisk {name}: RiskClass {risk_cls} != {exp_c}")


# --- 3. ANOMALY DETECTION MODEL TESTS ---
print("\n[3] Testing AnomalyDetectionModel...")

scenarios_anomaly = [
    {
        "name": "Normal Daily Txn",
        "payload": {"transaction": {"amount": 500, "recent_amounts": [400, 600, 450, 550], "merchant_category": "grocery"}},
        "expected_anomalous": False,
    },
    {
        "name": "Spike Amount Anomaly",
        "payload": {"transaction": {"amount": 8000, "recent_amounts": [500, 600, 450, 550], "merchant_category": "retail"}},
        "expected_anomalous": True,
    },
    {
        "name": "High Value Txn Anomaly",
        "payload": {"transaction": {"amount": 75000, "recent_amounts": [10000, 12000, 15000], "merchant_category": "electronics"}},
        "expected_anomalous": True,
    },
    {
        "name": "Suspicious Merchant Category",
        "payload": {"transaction": {"amount": 2000, "recent_amounts": [1500, 2000, 1800], "merchant_category": "gambling"}},
        "expected_anomalous": True,
    },
]

for s in scenarios_anomaly:
    res = service.detect_anomaly(s["payload"])
    score = res.get("anomaly_score")
    is_anom = res.get("is_anomalous")
    name = s["name"]
    exp_a = s["expected_anomalous"]
    print(f"  - {name}: Score={score}, IsAnomalous={is_anom}")
    if is_anom != exp_a:
        test_failures.append(f"Anomaly {name}: IsAnomalous {is_anom} != {exp_a}")


# --- 4. CASHFLOW FORECAST MODEL TESTS ---
print("\n[4] Testing CashFlowForecastModel...")

scenarios_forecast = [
    {
        "name": "Growing Balance Trend",
        "payload": {"balance_history": [20000, 25000, 30000, 35000, 40000]},
        "expected_low_risk": False,
        "trend_check": "growing",
    },
    {
        "name": "Draining Balance Trend",
        "payload": {"balance_history": [50000, 40000, 30000, 20000, 10000]},
        "expected_low_risk": True,
        "trend_check": "draining",
    },
    {
        "name": "Severe Balance Dip",
        "payload": {"balance_history": [60000, 5000, 40000]},
        "expected_low_risk": True,
    },
]

for s in scenarios_forecast:
    res = service.forecast_balance(s["payload"])
    f7 = res.get("forecast_7d")
    f30 = res.get("forecast_30d")
    risk = res.get("low_balance_risk")
    name = s["name"]
    exp_r = s["expected_low_risk"]
    print(f"  - {name}: 7d={f7}, 30d={f30}, LowBalanceRisk={risk}")
    if risk != exp_r:
        test_failures.append(f"CashFlow {name}: LowBalanceRisk {risk} != {exp_r}")
    if s.get("trend_check") == "growing" and not (f30 > f7 > 40000):
        test_failures.append(f"CashFlow {name}: Forecast slope not growing as expected")
    if s.get("trend_check") == "draining" and not (f30 < f7 < 10000):
        test_failures.append(f"CashFlow {name}: Forecast slope not draining as expected")


# --- 5. WELLNESS RECOMMENDATION MODEL TESTS ---
print("\n[5] Testing WellnessRecommendationModel...")

scenarios_wellness = [
    {
        "name": "Low Savings Rate",
        "payload": {"features": {"savings_rate": 0.05, "debt_income_ratio": 0.2, "discretionary_spending_ratio": 0.2}},
        "expected_code": "SAVE_MORE",
    },
    {
        "name": "High Debt Burden",
        "payload": {"features": {"savings_rate": 0.20, "debt_income_ratio": 0.55, "discretionary_spending_ratio": 0.2}},
        "expected_code": "DEBT_REBALANCE",
    },
    {
        "name": "High Discretionary Spend",
        "payload": {"features": {"savings_rate": 0.20, "debt_income_ratio": 0.3, "discretionary_spending_ratio": 0.40}},
        "expected_code": "SPEND_TRIM",
    },
    {
        "name": "High Risk Profile",
        "payload": {
            "features": {
                "savings_rate": 0.20,
                "debt_income_ratio": 0.3,
                "discretionary_spending_ratio": 0.2,
                "health_score": 40.0,
            }
        },
        "expected_code": "EMERGENCY_BUFFER",
    },
    {
        "name": "Healthy Balance Profile",
        "payload": {
            "features": {
                "savings_rate": 0.25,
                "debt_income_ratio": 0.2,
                "discretionary_spending_ratio": 0.15,
                "health_score": 85.0,
            }
        },
        "expected_code": "ON_TRACK",
    },
]

for s in scenarios_wellness:
    res = service.recommend_wellness(s["payload"])
    advice = res.get("advice")
    code = res.get("recommendation_code")
    name = s["name"]
    exp_c = s["expected_code"]
    print(f"  - {name}: Code={code} | Advice=\"{advice[:60]}...\"")
    if code != exp_c:
        test_failures.append(f"Wellness {name}: Code {code} != {exp_c}")

print("\n" + "=" * 60)
if test_failures:
    print(f"TEST SUITE COMPLETED WITH {len(test_failures)} FAILURES:")
    for f in test_failures:
        print("  [FAIL]", f)
    sys.exit(1)
else:
    print("SUCCESS: ALL 18 SCENARIOS PASSED WITH 100% ACCURACY!")
print("=" * 60)
