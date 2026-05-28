from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from app.db.base import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contact_email = Column(String)
    lead_time_days = Column(Integer, default=3)
    reliability_score = Column(Float, default=1.0)

    products = relationship("Product", back_populates="supplier")
