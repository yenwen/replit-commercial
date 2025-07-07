export type PropertyType = 'multifamily' | 'office' | 'retail' | 'mixed-use'

export interface RentRollUnit {
  unitNumber: string
  unitType: string
  bedrooms: number
  bathrooms: number
  squareFootage: number
  monthlyRent: number
  occupied: boolean
  leaseEndDate?: string
}

export interface OperatingExpenses {
  propertyTax: number
  insurance: number
  utilities: number
  maintenance: number
  propertyManagement: number
  other: number
  total: number
}

export interface LoanTerms {
  loanAmount: number
  ltv: number
  interestRate: number
  amortizationPeriod: number
  monthlyPayment: number
}

export interface ExitAssumptions {
  holdPeriod: number
  exitCapRate: number
  annualAppreciation: number
  marketCapRate: number
}

export interface DealInput {
  propertyType: PropertyType
  purchasePrice: number
  numberOfUnits: number
  rentRoll: RentRollUnit[]
  vacancyRate: number
  operatingExpenses: OperatingExpenses
  capexBudget: number
  loanTerms: LoanTerms
  exitAssumptions: ExitAssumptions
}

export interface FinancialMetrics {
  noi: number
  goingInCapRate: number
  reversionCapRate: number
  cashOnCashReturn: number
  stabilizedCashOnCash: number
  irr: number
  equityMultiple: number
  breakEvenOccupancy: number
  dscr: number
  exitSalePrice: number
  totalCashFlow: number[]
  equityReturn: number[]
}

export interface SensitivityTable {
  exitCapRates: number[]
  salePrices: number[]
  irrs: number[]
}

export interface AIAnalysis {
  summary: string
  redFlags: string[]
  recommendations: string[]
}

export interface DealAnalysis {
  dealInput: DealInput
  financialMetrics: FinancialMetrics
  sensitivityTable: SensitivityTable
  aiAnalysis: AIAnalysis
}

export interface FileUploadResponse {
  success: boolean
  data?: RentRollUnit[]
  error?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
} 