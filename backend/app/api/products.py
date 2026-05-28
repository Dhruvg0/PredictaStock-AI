from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
import pandas as pd
from app.models.product import Product
from app.models.store import Store
from app.models.inventory import Inventory
import io

router = APIRouter()

@router.post("/bulk-upload")
async def bulk_upload_products(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    contents = await file.read()
    try:
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to parse CSV file")
        
    added_products = 0
    added_inventory = 0
    
    for _, row in df.iterrows():
        sku = str(row.get("sku", ""))
        if not sku:
            continue
            
        # 1. Product
        product = db.query(Product).filter(Product.sku == sku).first()
        if not product:
            product = Product(
                sku=sku,
                name=str(row.get("name", "Unknown Product")),
                category=str(row.get("category", "General")),
                price=float(row.get("price", 0)),
                cost=float(row.get("cost", 0))
            )
            db.add(product)
            db.commit()
            db.refresh(product)
            added_products += 1
            
        # 2. Store
        store_name = str(row.get("store_name", "Main Store"))
        store_id_str = store_name.lower().replace(" ", "-")
        store = db.query(Store).filter(Store.store_id == store_id_str).first()
        if not store:
            store = Store(store_id=store_id_str, name=store_name, location="Unknown", capacity=1000)
            db.add(store)
            db.commit()
            db.refresh(store)
            
        # 3. Inventory
        qty = float(row.get("quantity_on_hand", 0))
        threshold = float(row.get("reorder_threshold", 0))
        
        inv = db.query(Inventory).filter(Inventory.store_id == store.id, Inventory.product_id == product.id).first()
        if inv:
            inv.quantity_on_hand = qty
            inv.reorder_threshold = threshold
        else:
            inv = Inventory(
                store_id=store.id,
                product_id=product.id,
                quantity_on_hand=qty,
                reorder_threshold=threshold,
                safety_stock=threshold * 1.5
            )
            db.add(inv)
            added_inventory += 1
            
    db.commit()
    return {"message": f"Successfully processed CSV. Added {added_products} new products and {added_inventory} new inventory records."}
