from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    quantity_on_hand = Column(Float, default=0)
    reorder_threshold = Column(Float, default=0)
    safety_stock = Column(Float, default=0)
    
    last_updated = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    store = relationship("Store", back_populates="inventory")
    product = relationship("Product", back_populates="inventory")
