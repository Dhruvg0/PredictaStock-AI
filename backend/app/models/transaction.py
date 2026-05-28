from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    transaction_type = Column(String, nullable=False) # e.g. "SALE", "RESTOCK", "DAMAGE"
    quantity = Column(Float, nullable=False)
    date = Column(DateTime(timezone=True), server_default=func.now())

    store = relationship("Store", back_populates="transactions")
    product = relationship("Product", back_populates="transactions")
