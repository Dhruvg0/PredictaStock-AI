import os
import sys
from datetime import datetime, timedelta
import random

# Add parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models import User, Store, Supplier, Product, Inventory, Transaction

def seed_data():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if we already seeded
    if db.query(Store).first():
        print("Database already seeded!")
        db.close()
        return

    print("Seeding stores...")
    stores = [
        Store(store_id="S001", name="Downtown Metro", location="Downtown", capacity=5000),
        Store(store_id="S002", name="Uptown Express", location="Uptown", capacity=3000),
        Store(store_id="S003", name="Suburban Supercenter", location="Suburbs", capacity=10000),
    ]
    db.add_all(stores)
    db.commit()

    print("Seeding suppliers...")
    suppliers = [
        Supplier(name="FreshFarm Produce", contact_email="contact@freshfarm.com", lead_time_days=2),
        Supplier(name="Global Groceries Inc.", contact_email="sales@globalgroceries.com", lead_time_days=5),
        Supplier(name="Dairy Best", contact_email="orders@dairybest.com", lead_time_days=1)
    ]
    db.add_all(suppliers)
    db.commit()

    print("Seeding products...")
    products = [
        Product(sku="PRD-001", name="Organic Bananas", category="Produce", price=1.99, cost=0.50, supplier_id=suppliers[0].id),
        Product(sku="PRD-002", name="Whole Milk 1 Gallon", category="Dairy", price=3.49, cost=2.00, supplier_id=suppliers[2].id),
        Product(sku="PRD-003", name="Canned Black Beans", category="Pantry", price=0.99, cost=0.30, supplier_id=suppliers[1].id),
        Product(sku="PRD-004", name="Loaf of Bread", category="Bakery", price=2.49, cost=1.00, supplier_id=suppliers[1].id),
        Product(sku="PRD-005", name="Free-Range Eggs (Dozen)", category="Dairy", price=4.99, cost=3.00, supplier_id=suppliers[2].id)
    ]
    db.add_all(products)
    db.commit()

    print("Seeding inventory...")
    inventories = []
    for store in stores:
        for product in products:
            qty = random.uniform(50, 500)
            safety = random.uniform(20, 100)
            inv = Inventory(
                store_id=store.id,
                product_id=product.id,
                quantity_on_hand=qty,
                reorder_threshold=safety * 1.5,
                safety_stock=safety
            )
            inventories.append(inv)
    db.add_all(inventories)
    db.commit()

    print("Database seeded successfully!")
    db.close()

if __name__ == "__main__":
    seed_data()
