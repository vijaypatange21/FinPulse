import pickle
from pathlib import Path

from .predictors import (
    AnomalyDetectionModel,
    CashFlowForecastModel,
    DefaultRiskModel,
    HealthScoreModel,
    WellnessRecommendationModel,
)


class MLModelService:
    def __init__(self):
        model_dir = Path(__file__).resolve().parent.parent / "saved_models"
        self._models = {
            "health_score": self._safe_load(model_dir / "health_score_model.pkl", HealthScoreModel()),
            "default_risk": self._safe_load(model_dir / "default_risk_model.pkl", DefaultRiskModel()),
            "anomaly": self._safe_load(model_dir / "anomaly_detection_model.pkl", AnomalyDetectionModel()),
            "forecast": self._safe_load(model_dir / "cashflow_forecast_model.pkl", CashFlowForecastModel()),
            "wellness": self._safe_load(model_dir / "wellness_recommendation_model.pkl", WellnessRecommendationModel()),
        }

    @staticmethod
    def _safe_load(model_path, fallback_model):
        try:
            with open(model_path, "rb") as file_handle:
                loaded_model = pickle.load(file_handle)
                if hasattr(loaded_model, "predict"):
                    return loaded_model
        except Exception:
            return fallback_model
        return fallback_model

    @staticmethod
    def _predict(model, payload):
        result = model.predict(payload)
        if isinstance(result, dict):
            return result
        return {"result": result}

    def predict_health_score(self, payload):
        return self._predict(self._models["health_score"], payload)

    def predict_default_risk(self, payload):
        return self._predict(self._models["default_risk"], payload)

    def detect_anomaly(self, payload):
        return self._predict(self._models["anomaly"], payload)

    def forecast_balance(self, payload):
        return self._predict(self._models["forecast"], payload)

    def recommend_wellness(self, payload):
        return self._predict(self._models["wellness"], payload)
