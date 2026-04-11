from statistics import mean


class DummyHealthScoreModel:
    def predict(self, payload):
        features = payload.get("features", {})
        monthly_income = float(features.get("monthly_income", 0))
        total_expense = float(features.get("total_expense", 0))
        emi_income_ratio = float(features.get("emi_income_ratio", 0.5))
        savings_rate = float(features.get("savings_rate", 0.0))
        cashflow_volatility = float(features.get("cashflow_volatility", 0.5))

        base = 60.0
        income_component = min(monthly_income / 3000.0, 20.0)
        savings_component = savings_rate * 30.0
        stress_penalty = (emi_income_ratio * 25.0) + (cashflow_volatility * 20.0)
        expense_penalty = min(total_expense / 5000.0, 12.0)
        score = max(0.0, min(100.0, base + income_component + savings_component - stress_penalty - expense_penalty))

        if score >= 75:
            risk_label = "Low"
        elif score >= 50:
            risk_label = "Medium"
        else:
            risk_label = "High"

        return {"health_score": round(score, 2), "risk_label": risk_label}


class DummyDefaultRiskModel:
    def predict(self, payload):
        features = payload.get("features", {})
        health_score = float(features.get("health_score", 50))
        missed_emi = float(features.get("missed_emi", 0))
        income_variance = float(features.get("income_variance", 0))
        active_loans = float(features.get("active_loans", 1))

        probability = (100 - health_score) / 150.0
        probability += min(missed_emi * 0.08, 0.4)
        probability += min(income_variance * 0.2, 0.2)
        probability += min(active_loans * 0.03, 0.15)
        probability = max(0.01, min(probability, 0.99))

        if probability < 0.25:
            risk_class = "Safe"
        elif probability < 0.6:
            risk_class = "Watch"
        else:
            risk_class = "High Risk"

        return {"default_probability": round(probability, 4), "risk_class": risk_class}


class DummyAnomalyDetectionModel:
    def predict(self, payload):
        txn = payload.get("transaction", {})
        amount = abs(float(txn.get("amount", 0)))
        history = txn.get("recent_amounts", [])
        baseline = mean(history) if history else 1000.0
        ratio = amount / max(baseline, 1.0)
        anomaly_score = min(1.0, ratio / 5.0)
        return {
            "anomaly_score": round(anomaly_score, 4),
            "is_anomalous": anomaly_score >= 0.6,
        }


class DummyCashFlowForecastModel:
    def predict(self, payload):
        history = [float(x) for x in payload.get("balance_history", []) if x is not None]
        if not history:
            history = [0.0]
        last = history[-1]
        trend = 0.0
        if len(history) >= 2:
            trend = (history[-1] - history[0]) / max(len(history) - 1, 1)
        forecast_7d = last + (trend * 7)
        forecast_30d = last + (trend * 30)
        low_balance_risk = forecast_30d <= 0 or min(history) < (0.25 * max(history))
        return {
            "forecast_7d": round(forecast_7d, 2),
            "forecast_30d": round(forecast_30d, 2),
            "low_balance_risk": low_balance_risk,
        }


class DummyWellnessRecommendationModel:
    def predict(self, payload):
        features = payload.get("features", {})
        savings_rate = float(features.get("savings_rate", 0.0))
        debt_income_ratio = float(features.get("debt_income_ratio", 0.0))
        discretionary_spending_ratio = float(features.get("discretionary_spending_ratio", 0.0))

        if savings_rate < 0.15:
            return {
                "advice": "Increase savings by at least 10% using automated transfers.",
                "recommendation_code": "SAVE_MORE",
            }
        if debt_income_ratio > 0.45:
            return {
                "advice": "Prioritize high-interest debt reduction before new borrowing.",
                "recommendation_code": "DEBT_REBALANCE",
            }
        if discretionary_spending_ratio > 0.35:
            return {
                "advice": "Reduce discretionary spending by 8-12% over the next month.",
                "recommendation_code": "SPEND_TRIM",
            }
        return {
            "advice": "Profile is healthy. Maintain current habits and track monthly variance.",
            "recommendation_code": "ON_TRACK",
        }
