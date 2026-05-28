from app.db.session import SessionLocal
from app.models.inventory import Inventory
from app.models.product import Product
from app.models.store import Store

def reset_db():
    db = SessionLocal()
    try:
        db.query(Inventory).delete()
        db.query(Product).delete()
        db.query(Store).delete()
        db.commit()
        print("Database has been reset successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error resetting database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_db()
