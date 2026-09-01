from statistics import mean


class HealthScoreModel:
    """
    Financial Health Score Model (0 - 100).
    Evaluates income, expenses, savings rate, EMI-to-income ratio, and volatility.
    """

    def predict(self, payload):
        features = payload.get("features", payload) if isinstance(payload, dict) else {}

        monthly_income = float(features.get("monthly_income", 50000))
        total_expense = float(features.get("total_expense", features.get("total_expenses", 30000)))
        savings_rate = float(
            features.get(
                "savings_rate",
                (monthly_income - total_expense) / monthly_income if monthly_income > 0 else 0.2,
            )
        )
        emi_income_ratio = float(features.get("emi_income_ratio", 0.25))
        cashflow_volatility = float(features.get("cashflow_volatility", 0.15))
        credit_history_length = float(features.get("credit_history_length", 2))

        # Condition-based scoring logic
        base_score = 50.0
        income_bonus = min((monthly_income / 50000.0) * 15.0, 25.0)
        savings_bonus = min(max(savings_rate, 0.0) * 30.0, 25.0)
        history_bonus = min(credit_history_length * 2.5, 10.0)

        debt_penalty = min(max(emi_income_ratio, 0.0) * 35.0, 30.0)
        volatility_penalty = min(max(cashflow_volatility, 0.0) * 25.0, 20.0)
        expense_ratio = (total_expense / monthly_income) if monthly_income > 0 else 0.8
        expense_penalty = 15.0 if expense_ratio > 0.85 else (8.0 if expense_ratio > 0.7 else 0.0)

        score = base_score + income_bonus + savings_bonus + history_bonus - debt_penalty - volatility_penalty - expense_penalty
        score = max(0.0, min(100.0, score))

        if score >= 75:
            risk_label = "Low"
        elif score >= 50:
            risk_label = "Medium"
        else:
            risk_label = "High"

        return {
            "health_score": round(score, 2),
            "risk_label": risk_label,
        }


class DefaultRiskModel:
    """
    Loan Default Risk Model.
    Outputs default probability (0.0 - 1.0) and risk class (Safe / Watch / High Risk).
    """

    def predict(self, payload):
        features = payload.get("features", payload) if isinstance(payload, dict) else {}

        health_score = float(features.get("health_score", 65.0))
        missed_emi = float(features.get("missed_emi", 0))
        income_variance = float(features.get("income_variance", 0.15))
        active_loans = float(features.get("active_loans", 1))
        emi_income_ratio = float(features.get("emi_income_ratio", 0.25))

        # Condition-based probability calculation
        base_probability = (100.0 - health_score) / 140.0

        # Conditional penalties
        if missed_emi >= 2:
            base_probability += 0.30
        elif missed_emi == 1:
            base_probability += 0.12

        if income_variance > 0.35:
            base_probability += 0.12
        elif income_variance > 0.2:
            base_probability += 0.06

        if active_loans >= 4:
            base_probability += 0.10
        elif active_loans >= 2:
            base_probability += 0.04

        if emi_income_ratio > 0.5:
            base_probability += 0.12

        probability = max(0.01, min(0.99, base_probability))

        if probability < 0.25:
            risk_class = "Safe"
        elif probability < 0.60:
            risk_class = "Watch"
        else:
            risk_class = "High Risk"

        return {
            "default_probability": round(probability, 4),
            "risk_class": risk_class,
        }


class AnomalyDetectionModel:
    """
    Transaction Anomaly / Fraud Detection Model.
    Evaluates transaction amounts against historical baseline, amount spikes, and suspicious patterns.
    """

    def predict(self, payload):
        txn = payload.get("transaction", payload) if isinstance(payload, dict) else {}

        amount = abs(float(txn.get("amount", 0)))
        history = txn.get("recent_amounts", [])
        merchant_category = str(txn.get("merchant_category", "")).lower()

        clean_history = [abs(float(x)) for x in history if x is not None]
        baseline = mean(clean_history) if clean_history else 1000.0
        ratio = amount / max(baseline, 1.0)

        # Conditions for flagging anomalies
        is_spike = ratio >= 3.5
        is_large_transaction = amount >= 50000.0
        is_suspicious_category = merchant_category in ["gambling", "crypto_exchange", "unknown_offshore"]

        if is_spike or is_large_transaction or is_suspicious_category:
            anomaly_score = min(0.99, max(0.65, ratio / 4.0))
            is_anomalous = True
        else:
            anomaly_score = min(0.45, max(0.02, ratio / 8.0))
            is_anomalous = False

        return {
            "anomaly_score": round(anomaly_score, 4),
            "is_anomalous": is_anomalous,
        }


class CashFlowForecastModel:
    """
    Time-Series Cash-Flow Forecast Model.
    Forecasts 7-day and 30-day account balance and flags low balance risk.
    """

    def predict(self, payload):
        raw_history = payload.get("balance_history", [45000, 46000, 47000, 46500, 48000]) if isinstance(payload, dict) else []
        history = [float(x) for x in raw_history if x is not None]

        if not history:
            history = [10000.0]

        last_balance = history[-1]
        
        # Calculate daily trend slope
        if len(history) >= 2:
            trend_slope = (history[-1] - history[0]) / float(max(len(history) - 1, 1))
        else:
            trend_slope = 0.0

        forecast_7d = last_balance + (trend_slope * 7)
        forecast_30d = last_balance + (trend_slope * 30)

        # Condition-based risk assessment
        peak_balance = max(history)
        min_balance = min(history)
        low_balance_risk = (
            forecast_30d < 5000.0
            or min_balance < (0.2 * peak_balance)
            or trend_slope < -500.0
        )

        return {
            "forecast_7d": round(forecast_7d, 2),
            "forecast_30d": round(forecast_30d, 2),
            "low_balance_risk": low_balance_risk,
        }


class WellnessRecommendationModel:
    """
    Rule Engine for Financial Wellness Recommendations.
    Evaluates savings, debt-to-income, discretionary spending, and overall risk to return actionable advice.
    """

    def predict(self, payload):
        features = payload.get("features", payload) if isinstance(payload, dict) else {}

        savings_rate = float(features.get("savings_rate", 0.15))
        debt_income_ratio = float(features.get("debt_income_ratio", 0.3))
        discretionary_spending_ratio = float(features.get("discretionary_spending_ratio", 0.25))
        health_score = float(features.get("health_score", 70.0))
        risk_class = str(features.get("risk_class", "Safe"))

        # Rule hierarchy / Condition tree
        if savings_rate < 0.10:
            return {
                "advice": "Your savings rate is below target. Set up automatic monthly transfers to save at least 15% of your income.",
                "recommendation_code": "SAVE_MORE",
            }
        elif debt_income_ratio > 0.45:
            return {
                "advice": "High debt ratio detected. Prioritize clearing high-interest obligations before taking on new loans.",
                "recommendation_code": "DEBT_REBALANCE",
            }
        elif discretionary_spending_ratio > 0.35:
            return {
                "advice": "Non-essential spending is elevated. Trim discretionary expenses by 10% to strengthen your cash flow.",
                "recommendation_code": "SPEND_TRIM",
            }
        elif health_score < 50.0 or risk_class in ["High Risk", "High"]:
            return {
                "advice": "Elevated risk profile. Build an emergency liquidity buffer covering at least 3 months of EMI payments.",
                "recommendation_code": "EMERGENCY_BUFFER",
            }
        else:
            return {
                "advice": "Your financial health profile is strong and on track. Maintain current savings habits and monitor monthly variance.",
                "recommendation_code": "ON_TRACK",
            }
