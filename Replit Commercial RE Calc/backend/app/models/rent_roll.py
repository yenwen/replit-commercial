from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class RentRollUnit(Base):
    __tablename__ = "rent_roll_units"
    
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id"))
    unit_number = Column(String)
    unit_type = Column(String)
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    square_footage = Column(Float)
    monthly_rent = Column(Float)
    occupied = Column(Boolean, default=True)
    lease_end_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    deal = relationship("Deal", back_populates="rent_roll_units") 