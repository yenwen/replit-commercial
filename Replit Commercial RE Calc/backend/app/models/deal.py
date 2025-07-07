from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Deal(Base):
    __tablename__ = "deals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    property_type = Column(String)
    purchase_price = Column(Float)
    number_of_units = Column(Integer)
    vacancy_rate = Column(Float)
    operating_expenses = Column(JSON)  # Store as JSON
    capex_budget = Column(Float)
    loan_terms = Column(JSON)  # Store as JSON
    exit_assumptions = Column(JSON)  # Store as JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="deals")
    rent_roll_units = relationship("RentRollUnit", back_populates="deal")
    analysis = relationship("DealAnalysis", back_populates="deal", uselist=False)

class DealAnalysis(Base):
    __tablename__ = "deal_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id"))
    financial_metrics = Column(JSON)  # Store calculated metrics
    sensitivity_table = Column(JSON)  # Store sensitivity analysis
    ai_analysis = Column(JSON)  # Store AI insights
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    deal = relationship("Deal", back_populates="analysis") 