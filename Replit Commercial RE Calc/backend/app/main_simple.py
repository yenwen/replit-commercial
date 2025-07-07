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

class LoanTerms(BaseModel):
    ltv: float = 75.0
    interestRate: float = 5.5
    amortizationPeriod: int = 30
    isInterestOnly: bool = False
    interestOnlyMonths: int = 0

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

# Simple financial calculations
def calculate_financial_metrics(deal_input: DealInput) -> FinancialMetrics:
    """Calculate basic financial metrics"""

    # Calculate gross income
    total_rent = sum(unit.monthlyRent for unit in deal_input.rentRoll)
    annual_gross_income = total_rent * 12

    # Calculate vacancy loss
    vacancy_loss = annual_gross_income * (deal_input.vacancyRate / 100)

    # Calculate operating expenses
    total_expenses = (
        deal_input.operatingExpenses.propertyTax +
        deal_input.operatingExpenses.insurance +
        deal_input.operatingExpenses.utilities +
        deal_input.operatingExpenses.maintenance +
        deal_input.operatingExpenses.propertyManagement +
        deal_input.operatingExpenses.other
    )

    # Calculate NOI
    noi = annual_gross_income - vacancy_loss - total_expenses

    # Calculate cap rates
    going_in_cap_rate = (noi / deal_input.purchasePrice) * 100

    # Calculate loan amount and payment
    loan_amount = deal_input.purchasePrice * (deal_input.loanTerms.ltv / 100)
    monthly_rate = deal_input.loanTerms.interestRate / 100 / 12
    num_payments = deal_input.loanTerms.amortizationPeriod * 12

    if deal_input.loanTerms.isInterestOnly and deal_input.loanTerms.interestOnlyMonths > 0:
        # Interest-only payment for the specified period
        interest_only_payment = loan_amount * monthly_rate

        # Calculate remaining amortization period after interest-only
        remaining_months = num_payments - deal_input.loanTerms.interestOnlyMonths

        if remaining_months > 0 and monthly_rate > 0:
            # Amortizing payment for remaining period
            amortizing_payment = loan_amount * (monthly_rate * (1 + monthly_rate) ** remaining_months) / ((1 + monthly_rate) ** remaining_months - 1)
        else:
            amortizing_payment = loan_amount / remaining_months if remaining_months > 0 else 0

        # Use interest-only payment for the first year (assumption for NOI calculation)
        monthly_payment = interest_only_payment
    else:
        # Standard amortizing payment
        if monthly_rate > 0:
            monthly_payment = loan_amount * (monthly_rate * (1 + monthly_rate) ** num_payments) / ((1 + monthly_rate) ** num_payments - 1)
        else:
            monthly_payment = loan_amount / num_payments

    annual_debt_service = monthly_payment * 12

    # Calculate cash flow
    annual_cash_flow = noi - annual_debt_service

    # Calculate cash-on-cash return
    equity_investment = deal_input.purchasePrice - loan_amount
    cash_on_cash = (annual_cash_flow / equity_investment) * 100 if equity_investment > 0 else 0

    # Calculate DSCR
    dscr = noi / annual_debt_service if annual_debt_service > 0 else 0

    # Calculate exit value
    exit_value = deal_input.purchasePrice * (1 + deal_input.exitAssumptions.annualAppreciation / 100) ** deal_input.exitAssumptions.holdPeriod

    # Calculate reversion cap rate
    reversion_cap_rate = (noi / exit_value) * 100

    # Simple IRR calculation (simplified)
    irr = (exit_value / deal_input.purchasePrice) ** (1 / deal_input.exitAssumptions.holdPeriod) - 1
    irr_percentage = irr * 100

    # Equity multiple
    equity_multiple = (exit_value - loan_amount) / equity_investment if equity_investment > 0 else 0

    # Break-even occupancy (simplified)
    break_even_occupancy = (total_expenses + annual_debt_service) / annual_gross_income * 100

    return FinancialMetrics(
        noi=noi,
        goingInCapRate=going_in_cap_rate,
        reversionCapRate=reversion_cap_rate,
        cashOnCashReturn=cash_on_cash,
        stabilizedCashOnCash=cash_on_cash,  # Simplified
        irr=irr_percentage,
        equityMultiple=equity_multiple,
        breakEvenOccupancy=break_even_occupancy,
        dscr=dscr,
        exitSalePrice=exit_value
    )

def generate_ai_analysis(deal_input: DealInput, metrics: FinancialMetrics) -> AIAnalysis:
    """Generate AI-like analysis"""

    summary_parts = []
    red_flags = []
    recommendations = []

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

    # Generate summary
    if not summary_parts:
        summary_parts.append("This deal shows moderate returns with standard risk profile")

    summary = f"This {deal_input.propertyType} property with {deal_input.numberOfUnits} units shows a {metrics.goingInCapRate:.1f}% cap rate and {metrics.cashOnCashReturn:.1f}% cash-on-cash return. {'. '.join(summary_parts)}."

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