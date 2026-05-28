import os
import sys
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.inventory import Inventory

# Import ML model wrapper
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
try:
    from ml.inference import get_demand_forecast
except ImportError:
    # Dummy fallback if ML is not set up
    def get_demand_forecast(*args, **kwargs):
        return 10.0

router = APIRouter()

@router.get("/predict/{inventory_id}")
def predict_demand(inventory_id: int, db: Session = Depends(get_db)):
    inv = db.query(Inventory).filter(Inventory.id == inventory_id).first()
    if not inv:
        return {"error": "Inventory item not found"}
    
    # We would pull real historical features from the DB here
    # For now, we mock features to test the pipeline
    features = {
        "price": 2.5,
        "day_of_week": 1,
        "month": 5,
        "is_weekend": 0,
        "lag_1": 50,
        "lag_7": 300,
        "rolling_mean_7": 45
    }
    
    forecast = get_demand_forecast(
        store_id=inv.store_id,
        product_id=inv.product_id,
        current_features=features
    )
    
    return {
        "inventory_id": inventory_id,
        "forecasted_demand_next_day": forecast
    }
