from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.inventory import Inventory
from app.models.store import Store
from app.models.product import Product

from app.schemas.inventory import InventoryCreate, BulkDeleteRequest

router = APIRouter()

@router.get("/")
def get_inventory(db: Session = Depends(get_db)):
    results = db.query(Inventory, Store, Product).join(Store).join(Product).all()
    data = []
    for inv, store, product in results:
        # Simple risk calculation
        days_stock_left = 0
        if inv.reorder_threshold > 0:
            days_stock_left = inv.quantity_on_hand / (inv.reorder_threshold / 7.0) # Assuming threshold is based on weekly demand

        risk_level = "Low Risk"
        if days_stock_left < 3:
            risk_level = "High Risk"
        elif days_stock_left < 7:
            risk_level = "Medium Risk"

        data.append({
            "id": inv.id,
            "store_id": store.store_id,
            "store_name": store.name,
            "product_sku": product.sku,
            "product_name": product.name,
            "quantity_on_hand": inv.quantity_on_hand,
            "reorder_threshold": inv.reorder_threshold,
            "safety_stock": inv.safety_stock,
            "risk_level": risk_level,
            "days_stock_left": days_stock_left
        })
    return data

@router.post("/")
def create_inventory_item(item: InventoryCreate, db: Session = Depends(get_db)):
    # 1. Get or Create Product
    product = db.query(Product).filter(Product.sku == item.product_sku).first()
    if not product:
        product = Product(sku=item.product_sku, name=item.product_name, category="General", price=0.0, cost=0.0)
        db.add(product)
        db.commit()
        db.refresh(product)

    # 2. Get or Create Store
    store_id_str = item.store_name.lower().replace(" ", "-")
    store = db.query(Store).filter(Store.store_id == store_id_str).first()
    if not store:
        store = Store(store_id=store_id_str, name=item.store_name, location="Unknown", capacity=1000)
        db.add(store)
        db.commit()
        db.refresh(store)

    # 3. Create or Update Inventory
    inv = db.query(Inventory).filter(Inventory.store_id == store.id, Inventory.product_id == product.id).first()
    if inv:
        inv.quantity_on_hand = item.quantity_on_hand
        inv.reorder_threshold = item.reorder_threshold
    else:
        inv = Inventory(
            store_id=store.id,
            product_id=product.id,
            quantity_on_hand=item.quantity_on_hand,
            reorder_threshold=item.reorder_threshold,
            safety_stock=item.reorder_threshold * 1.5
        )
        db.add(inv)
    
    db.commit()
    return {"message": "Inventory added successfully", "inventory_id": inv.id}

@router.delete("/bulk")
def bulk_delete_inventory(req: BulkDeleteRequest, db: Session = Depends(get_db)):
    if req.delete_all:
        db.query(Inventory).delete()
    elif req.ids and len(req.ids) > 0:
        db.query(Inventory).filter(Inventory.id.in_(req.ids)).delete(synchronize_session=False)
    
    db.commit()
    return {"message": "Inventory deleted successfully"}
