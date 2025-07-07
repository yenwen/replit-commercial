from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
import json

from app.core.database import get_db
from app.services.calculations import FinancialCalculator
from app.services.ai_analysis import AIAnalyzer
from app.schemas.deal import DealInput, DealAnalysisResponse

router = APIRouter()

@router.post("/analyze-deal", response_model=DealAnalysisResponse)
async def analyze_deal(
    deal_input: DealInput,
    db: Session = Depends(get_db)
):
    """
    Analyze a commercial real estate deal and return financial metrics and AI insights
    """
    try:
        # Initialize calculators
        calculator = FinancialCalculator()
        ai_analyzer = AIAnalyzer()
        
        # Calculate financial metrics
        financial_metrics = calculator.calculate_all_metrics(deal_input)
        
        # Generate AI analysis
        ai_analysis = ai_analyzer.analyze_deal(deal_input, financial_metrics)
        
        # Create sensitivity table
        sensitivity_table = calculator.create_sensitivity_table(deal_input, financial_metrics)
        
        # Prepare response
        analysis_result = {
            "dealInput": deal_input.dict(),
            "financialMetrics": financial_metrics,
            "sensitivityTable": sensitivity_table,
            "aiAnalysis": ai_analysis
        }
        
        return DealAnalysisResponse(**analysis_result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/metrics/{deal_id}")
async def get_deal_metrics(deal_id: int, db: Session = Depends(get_db)):
    """
    Get financial metrics for a specific deal
    """
    # TODO: Implement deal retrieval and metrics calculation
    pass

@router.post("/sensitivity-analysis")
async def sensitivity_analysis(
    deal_input: DealInput,
    db: Session = Depends(get_db)
):
    """
    Perform sensitivity analysis on deal parameters
    """
    try:
        calculator = FinancialCalculator()
        sensitivity_results = calculator.create_sensitivity_table(deal_input)
        return {"sensitivity_table": sensitivity_results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sensitivity analysis failed: {str(e)}") 