from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.inventory import Inventory
from app.models.store import Store
from app.models.product import Product

router = APIRouter()

@router.get("/")
def get_alerts(db: Session = Depends(get_db)):
    # 1. Fetch inventory items that are at risk
    results = db.query(Inventory, Store, Product).join(Store).join(Product).all()
    
    alerts = []
    alert_id = 1
    for inv, store, product in results:
        days_stock_left = 0
        if inv.reorder_threshold > 0:
            days_stock_left = inv.quantity_on_hand / (inv.reorder_threshold / 7.0)

        # Generate critical alerts
        if days_stock_left < 3:
            alerts.append({
                "id": alert_id,
                "type": "critical",
                "title": f"Stockout Imminent: {product.name}",
                "store": f"{store.store_id.upper()} - {store.name}",
                "time": "Just now",
                "message": f"Current inventory ({inv.quantity_on_hand}) is critically low. Reorder immediately."
            })
            alert_id += 1
        # Generate warnings
        elif days_stock_left < 7:
            alerts.append({
                "id": alert_id,
                "type": "warning",
                "title": f"Low Stock Warning: {product.name}",
                "store": f"{store.store_id.upper()} - {store.name}",
                "time": "Recent",
                "message": f"Inventory ({inv.quantity_on_hand}) is approaching the reorder threshold ({inv.reorder_threshold})."
            })
            alert_id += 1
            
    # Add some mock predictive alerts for demo purposes if list is empty or short
    if len(alerts) < 3:
        alerts.append({
            "id": alert_id,
            "type": "info",
            "title": "Predictive Insight: Dairy Products",
            "store": "All Stores",
            "time": "1 hour ago",
            "message": "XGBoost model predicts a 15% increase in dairy demand this weekend. Consider preemptive reordering."
        })
        alert_id += 1
        alerts.append({
            "id": alert_id,
            "type": "resolved",
            "title": "System Automated Restock",
            "store": "Main Warehouse",
            "time": "2 hours ago",
            "message": "Auto-replenishment successful for 12 fast-moving SKUs."
        })

    return alerts
