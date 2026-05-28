import os
import joblib
import pandas as pd
import numpy as np

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "xgboost_model.pkl")

class DemandPredictor:
    def __init__(self):
        self.model = None
        if os.path.exists(MODEL_PATH):
            self.model = joblib.load(MODEL_PATH)
            
    def predict(self, store_id: int, product_id: int, price: float, 
                day_of_week: int, month: int, is_weekend: int, 
                lag_1: float, lag_7: float, rolling_mean_7: float) -> float:
        if not self.model:
            # Fallback to rolling mean if model is not trained yet
            return rolling_mean_7
            
        features = pd.DataFrame([{
            "store_id": store_id,
            "product_id": product_id,
            "price": price,
            "day_of_week": day_of_week,
            "month": month,
            "is_weekend": is_weekend,
            "lag_1": lag_1,
            "lag_7": lag_7,
            "rolling_mean_7": rolling_mean_7
        }])
        
        prediction = self.model.predict(features)[0]
        return max(0, float(prediction)) # Demand cannot be negative

predictor = DemandPredictor()

def get_demand_forecast(store_id: int, product_id: int, current_features: dict) -> float:
    """
    Called by the backend to get a forecast.
    current_features should contain: price, day_of_week, month, is_weekend, lag_1, lag_7, rolling_mean_7
    """
    return predictor.predict(
        store_id=store_id,
        product_id=product_id,
        price=current_features.get("price", 0.0),
        day_of_week=current_features.get("day_of_week", 0),
        month=current_features.get("month", 1),
        is_weekend=current_features.get("is_weekend", 0),
        lag_1=current_features.get("lag_1", 0.0),
        lag_7=current_features.get("lag_7", 0.0),
        rolling_mean_7=current_features.get("rolling_mean_7", 0.0)
    )
