from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from app.db.base import Base

class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    location = Column(String)
    capacity = Column(Integer)

    inventory = relationship("Inventory", back_populates="store")
    transactions = relationship("Transaction", back_populates="store")
