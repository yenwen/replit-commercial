from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import json
from datetime import datetime

# Simple models for the demo
class RentRollUnit(BaseModel):
    unitNumber: str
    unitType: str
    bedrooms: int
    bathrooms: int
    squareFootage: float
    monthlyRent: float
    occupied: bool

class OperatingExpenses(BaseModel):
    propertyTax: float = 0
    insurance: float = 0
    utilities: float = 0
    maintenance: float = 0
    propertyManagement: float = 0
    other: float = 0
    total: float = 0

class LoanTerms(BaseModel):
    ltv: float = 75.0
    interestRate: float = 5.5
    amortizationPeriod: int = 30
    isInterestOnly: bool = False
    interestOnlyMonths: int = 0
    loanAmount: float = 0.0
    monthlyPayment: float = 0.0

class ExitAssumptions(BaseModel):
    holdPeriod: float = 5.0
    exitCapRate: float = 6.5
    annualAppreciation: float = 3.0
    marketCapRate: float = 6.0

class DealInput(BaseModel):
    propertyType: str
    purchasePrice: float
    numberOfUnits: int
    rentRoll: List[RentRollUnit]
    vacancyRate: float
    operatingExpenses: OperatingExpenses
    capexBudget: float
    loanTerms: LoanTerms
    exitAssumptions: ExitAssumptions

class FinancialMetrics(BaseModel):
    noi: float
    goingInCapRate: float
    reversionCapRate: float
    cashOnCashReturn: float
    stabilizedCashOnCash: float
    irr: float
    equityMultiple: float
    breakEvenOccupancy: float
    dscr: float
    exitSalePrice: float
    totalReturn: float
    annualCashFlow: float
    exitValue: float

class AIAnalysis(BaseModel):
    summary: str
    redFlags: List[str]
    recommendations: List[str]

class DealAnalysis(BaseModel):
    dealInput: DealInput
    financialMetrics: FinancialMetrics
    aiAnalysis: AIAnalysis

app = FastAPI(
    title="Commercial RE Calculator API",
    description="AI-Enhanced Deal Analyzer for Commercial Real Estate",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Add error handling middleware
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return {
        "error": "Internal server error",
        "detail": str(exc) if app.debug else "An unexpected error occurred",
        "type": type(exc).__name__
    }

# Function to calculate financial metrics
def calculate_financial_metrics(deal_input: DealInput) -> FinancialMetrics:
    """Calculate comprehensive financial metrics"""

    # Basic inputs
    purchase_price = deal_input.purchasePrice
    num_units = deal_input.numberOfUnits
    vacancy_rate = deal_input.vacancyRate / 100

    # Calculate total rent from rent roll
    total_monthly_rent = 0
    if deal_input.rentRoll:
        total_monthly_rent = sum(float(unit.monthlyRent) for unit in deal_input.rentRoll)

    # If no rent roll data, estimate based on units and market assumptions
    if total_monthly_rent == 0 and num_units > 0:
        # Estimate $1,500 per unit per month as default for calculation purposes
        estimated_rent_per_unit = 1500
        total_monthly_rent = float(num_units * estimated_rent_per_unit)

    annual_gross_income = float(total_monthly_rent * 12)

    # Apply vacancy
    effective_gross_income = float(annual_gross_income * (1 - vacancy_rate))

    # Operating expenses
    total_expenses = float(
        deal_input.operatingExpenses.propertyTax +
        deal_input.operatingExpenses.insurance +
        deal_input.operatingExpenses.utilities +
        deal_input.operatingExpenses.maintenance +
        deal_input.operatingExpenses.propertyManagement +
        deal_input.operatingExpenses.other
    )

    # If no operating expenses provided, estimate as 50% of effective gross income
    if total_expenses == 0 and effective_gross_income > 0:
        total_expenses = float(effective_gross_income * 0.5)

    # NOI calculation
    noi = float(effective_gross_income - total_expenses)

    # Safe division helper function
    def safe_divide(numerator, denominator, default=0):
        return numerator / denominator if denominator != 0 else default

    # Cap rates
    going_in_cap_rate = safe_divide(noi, purchase_price) * 100
    exit_cap_rate = deal_input.exitAssumptions.exitCapRate

    # Loan calculations
    loan_amount = float(deal_input.loanTerms.loanAmount) if deal_input.loanTerms.loanAmount else 0.0

    # If loan amount is 0, calculate from LTV
    if loan_amount == 0:
        ltv = float(deal_input.loanTerms.ltv) / 100
        loan_amount = float(purchase_price * ltv)

    monthly_payment = float(deal_input.loanTerms.monthlyPayment) if deal_input.loanTerms.monthlyPayment else 0.0

    # If monthly payment is 0, calculate it
    if monthly_payment == 0 and loan_amount > 0:
        interest_rate = float(deal_input.loanTerms.interestRate) / 100 / 12
        amort_months = int(deal_input.loanTerms.amortizationPeriod) * 12

        if deal_input.loanTerms.isInterestOnly:
            monthly_payment = float(loan_amount * (deal_input.loanTerms.interestRate / 100 / 12))
        else:
            if interest_rate > 0 and amort_months > 0:
                monthly_payment = float(loan_amount * (interest_rate * (1 + interest_rate)**amort_months) / ((1 + interest_rate)**amort_months - 1))
            elif amort_months > 0:
                monthly_payment = float(loan_amount / amort_months)
            else:
                monthly_payment = 0.0

    annual_debt_service = float(monthly_payment * 12)

    # DSCR
    dscr = safe_divide(noi, annual_debt_service, float('inf'))

    # Cash calculations
    down_payment = float(purchase_price - loan_amount)
    cash_flow_before_tax = float(noi - annual_debt_service)
    cash_on_cash_return = safe_divide(cash_flow_before_tax, down_payment) * 100 if down_payment > 0 else 0

    # IRR and NPV calculations (simplified)
    annual_cash_flow = float(noi - annual_debt_service)
    hold_period_years = int(deal_input.exitAssumptions.holdPeriod) if deal_input.exitAssumptions.holdPeriod else 5
    annual_cash_flows = [annual_cash_flow] * hold_period_years
    
    exit_cap_rate_decimal = float(exit_cap_rate) / 100 if exit_cap_rate > 0 else 0.065
    exit_value = safe_divide(noi, exit_cap_rate_decimal, purchase_price)

    # Calculate remaining loan balance (simplified)
    remaining_loan_balance = float(loan_amount * 0.8)  # Approximate after hold period
    final_cash_flow = float(annual_cash_flow + exit_value - remaining_loan_balance)
    
    if len(annual_cash_flows) > 0:
        annual_cash_flows[-1] = final_cash_flow

    # Simple IRR approximation
    total_return = float(sum(annual_cash_flows))
    hold_period = max(hold_period_years, 1)  # Avoid division by zero
    irr = safe_divide(total_return, down_payment) / hold_period * 100 if down_payment > 0 else 0

    # Update the deal input with calculated loan amount for consistency
    deal_input.loanTerms.loanAmount = loan_amount
    deal_input.loanTerms.monthlyPayment = monthly_payment

    return FinancialMetrics(
        noi=float(noi),
        goingInCapRate=float(going_in_cap_rate),
        reversionCapRate=float(exit_cap_rate),
        cashOnCashReturn=float(cash_on_cash_return),
        stabilizedCashOnCash=float(cash_on_cash_return),
        irr=float(irr),
        equityMultiple=float(safe_divide((exit_value - remaining_loan_balance), down_payment) if down_payment > 0 else 1.0),
        breakEvenOccupancy=float(0),
        dscr=float(dscr),
        exitSalePrice=float(exit_value),
        totalReturn=float(total_return),
        annualCashFlow=float(annual_cash_flow),
        exitValue=float(exit_value)
    )

def grade_metric(metric_type: str, value: float, num_units: int = 1) -> str:
    """Grade financial metrics with letter grades"""
    
    if metric_type == "cap_rate":
        if value >= 8.0: return "A+"
        elif value >= 7.0: return "A"
        elif value >= 6.0: return "B"
        elif value >= 5.0: return "C"
        else: return "D"
    
    elif metric_type == "cash_on_cash":
        if value >= 12: return "A+"
        elif value >= 10: return "A"
        elif value >= 8: return "B"
        elif value >= 6: return "C"
        else: return "D"
    
    elif metric_type == "dscr":
        if value >= 1.5: return "A+"
        elif value >= 1.35: return "A"
        elif value >= 1.25: return "B"
        elif value >= 1.15: return "C"
        else: return "D"
    
    elif metric_type == "irr":
        if value >= 15: return "A+"
        elif value >= 12: return "A"
        elif value >= 10: return "B"
        elif value >= 8: return "C"
        else: return "D"
    
    elif metric_type == "equity_multiple":
        if value >= 2.5: return "A+"
        elif value >= 2.0: return "A"
        elif value >= 1.75: return "B"
        elif value >= 1.5: return "C"
        else: return "D"
    
    elif metric_type == "noi_per_unit":
        noi_per_unit_monthly = (value / num_units) / 12 if num_units > 0 else 0
        if noi_per_unit_monthly >= 150: return "A+"
        elif noi_per_unit_monthly >= 125: return "A"
        elif noi_per_unit_monthly >= 100: return "B"
        elif noi_per_unit_monthly >= 75: return "C"
        else: return "D"
    
    return "C"

def generate_ai_analysis(deal_input: DealInput, metrics: FinancialMetrics) -> AIAnalysis:
    """Generate AI-like analysis with grading"""

    summary_parts = []
    red_flags = []
    recommendations = []
    
    # Grade key metrics
    cap_rate_grade = grade_metric("cap_rate", metrics.goingInCapRate)
    cash_on_cash_grade = grade_metric("cash_on_cash", metrics.cashOnCashReturn)
    dscr_grade = grade_metric("dscr", metrics.dscr)
    irr_grade = grade_metric("irr", metrics.irr)
    equity_multiple_grade = grade_metric("equity_multiple", metrics.equityMultiple)
    noi_grade = grade_metric("noi_per_unit", metrics.noi, deal_input.numberOfUnits)
    
    # Calculate overall grade based on key metrics
    grade_points = {
        "A+": 4.3, "A": 4.0, "B": 3.0, "C": 2.0, "D": 1.0
    }
    
    # Weight metrics by importance
    weighted_score = (
        grade_points.get(cap_rate_grade, 1.0) * 0.25 +  # 25% weight
        grade_points.get(cash_on_cash_grade, 1.0) * 0.25 +  # 25% weight
        grade_points.get(irr_grade, 1.0) * 0.25 +  # 25% weight
        grade_points.get(dscr_grade, 1.0) * 0.15 +  # 15% weight
        grade_points.get(equity_multiple_grade, 1.0) * 0.10  # 10% weight
    )
    
    # Convert weighted score to letter grade
    if weighted_score >= 4.0:
        overall_grade = "A+"
        investment_recommendation = "STRONG BUY"
    elif weighted_score >= 3.5:
        overall_grade = "A"
        investment_recommendation = "BUY"
    elif weighted_score >= 3.0:
        overall_grade = "B+"
        investment_recommendation = "BUY"
    elif weighted_score >= 2.5:
        overall_grade = "B"
        investment_recommendation = "HOLD/CONSIDER"
    elif weighted_score >= 2.0:
        overall_grade = "C"
        investment_recommendation = "AVOID"
    else:
        overall_grade = "D"
        investment_recommendation = "AVOID"

    # Analyze cap rate
    if metrics.goingInCapRate < 5:
        red_flags.append("Going-in cap rate is below 5%, indicating potentially overpriced property")
        recommendations.append("Consider negotiating a lower purchase price")
    elif metrics.goingInCapRate > 8:
        summary_parts.append("Strong going-in cap rate suggests good value")

    # Analyze DSCR
    if metrics.dscr < 1.2:
        red_flags.append("DSCR below 1.2 indicates high leverage risk")
        recommendations.append("Consider reducing loan amount or improving NOI")
    elif metrics.dscr > 1.5:
        summary_parts.append("Strong debt service coverage provides good safety margin")

    # Analyze cash-on-cash return
    if metrics.cashOnCashReturn < 6:
        red_flags.append("Cash-on-cash return below 6% may not meet investor requirements")
        recommendations.append("Look for ways to increase NOI or reduce expenses")
    elif metrics.cashOnCashReturn > 10:
        summary_parts.append("Excellent cash-on-cash return indicates strong cash flow")

    # Analyze vacancy rate
    if deal_input.vacancyRate > 10:
        red_flags.append("High vacancy rate may indicate market or property issues")
        recommendations.append("Investigate market conditions and property management")

    # Generate summary with grades
    if not summary_parts:
        summary_parts.append("This deal shows moderate returns with standard risk profile")

    grades_summary = f"Metric Grades: Cap Rate {cap_rate_grade} ({metrics.goingInCapRate:.1f}%), Cash-on-Cash {cash_on_cash_grade} ({metrics.cashOnCashReturn:.1f}%), DSCR {dscr_grade} ({metrics.dscr:.2f}x), IRR {irr_grade} ({metrics.irr:.1f}%), Equity Multiple {equity_multiple_grade} ({metrics.equityMultiple:.1f}x), NOI/Unit {noi_grade}"
    
    # Generate investment recommendation explanation
    investment_explanation = ""
    if investment_recommendation == "STRONG BUY":
        investment_explanation = "This deal shows exceptional returns across all key metrics. The combination of strong cash flow, solid debt coverage, and attractive cap rate makes this a premium investment opportunity."
    elif investment_recommendation == "BUY":
        investment_explanation = "This is a solid investment opportunity with good returns and manageable risk. The metrics indicate this property should perform well in the current market."
    elif investment_recommendation == "HOLD/CONSIDER":
        investment_explanation = "This deal has mixed results. While some metrics are acceptable, consider negotiating better terms or look for ways to improve performance before proceeding."
    else:
        investment_explanation = "This deal does not meet standard investment criteria. The returns are below market expectations and/or the risk profile is too high for most investors."
    
    summary = f"OVERALL GRADE: {overall_grade} - {investment_recommendation}. {investment_explanation} Analysis: {grades_summary}. {'. '.join(summary_parts)}."

    return AIAnalysis(
        summary=summary,
        redFlags=red_flags,
        recommendations=recommendations
    )

@app.get("/")
async def root():
    return {
        "message": "Commercial RE Calculator API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running",
        "environment": "replit-demo"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "environment": "replit-demo"
    }

@app.post("/api/analyze-deal", response_model=DealAnalysis)
async def analyze_deal(deal_input: DealInput):
    """Analyze a commercial real estate deal"""
    try:
        # Calculate financial metrics
        financial_metrics = calculate_financial_metrics(deal_input)

        # Generate AI analysis
        ai_analysis = generate_ai_analysis(deal_input, financial_metrics)

        return DealAnalysis(
            dealInput=deal_input,
            financialMetrics=financial_metrics,
            aiAnalysis=ai_analysis
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/api/test")
async def test_endpoint():
    return {
        "message": "API is working!",
        "timestamp": datetime.now().isoformat(),
        "features": [
            "Deal analysis",
            "Financial calculations",
            "AI insights",
            "Red flag detection"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 Starting Commercial RE Calculator API on port {port}")
    print(f"📖 API Documentation: http://0.0.0.0:{port}/docs")
    uvicorn.run(app, host="0.0.0.0", port=port)