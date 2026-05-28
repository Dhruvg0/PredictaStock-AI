from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, index=True)
    price = Column(Float, nullable=False)
    cost = Column(Float, nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))

    supplier = relationship("Supplier", back_populates="products")
    inventory = relationship("Inventory", back_populates="product")
    transactions = relationship("Transaction", back_populates="product")
