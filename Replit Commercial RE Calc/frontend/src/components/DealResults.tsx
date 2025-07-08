'use client'

import { Box, VStack, HStack, Heading, Text as ChakraText, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Alert, AlertIcon, Button, Table, Thead, Tbody, Tr, Th, Td, Card, CardBody } from '@chakra-ui/react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import { DealAnalysis, DealInput } from '@/types'
import SensitivityPanel from './SensitivityPanel'

// Cash Flow Chart Component
const CashFlowChart = ({ initialCashFlow, growth }: { initialCashFlow: number, growth: number }) => {
  const data = Array.from({ length: 10 }, (_, i) => ({
    year: i + 1,
    cashFlow: initialCashFlow * Math.pow(1 + growth / 100, i),
    cumulativeCashFlow: Array.from({ length: i + 1 }, (_, j) => 
      initialCashFlow * Math.pow(1 + growth / 100, j)
    ).reduce((sum, val) => sum + val, 0)
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
        <Tooltip 
          formatter={(value: number, name: string) => [
            `$${value.toLocaleString()}`, 
            name === 'cashFlow' ? 'Annual Cash Flow' : 'Cumulative Cash Flow'
          ]}
        />
        <Line type="monotone" dataKey="cashFlow" stroke="#3182CE" strokeWidth={2} name="cashFlow" />
        <Line type="monotone" dataKey="cumulativeCashFlow" stroke="#38A169" strokeWidth={2} name="cumulativeCashFlow" />
      </LineChart>
    </ResponsiveContainer>
  )
}

// IRR Waterfall Component
const IRRWaterfall = ({ cashOnCash, appreciation, totalIRR }: { 
  cashOnCash: number, 
  appreciation: number, 
  totalIRR: number 
}) => {
  const data = [
    { name: 'Cash-on-Cash Return', value: cashOnCash, color: '#3182CE' },
    { name: 'Appreciation Return', value: appreciation, color: '#38A169' },
    { name: 'Total IRR', value: totalIRR, color: '#805AD5' }
  ]

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
        <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, 'Return']} />
        <Bar dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// Sensitivity Table Component
const SensitivityTable = ({ baseCapRate, baseIRR, baseCashOnCash }: {
  baseCapRate: number,
  baseIRR: number,
  baseCashOnCash: number
}) => {
  const rentChanges = [-10, -5, 0, 5, 10]
  const priceChanges = [-10, -5, 0, 5, 10]

  const calculateIRRSensitivity = (rentChange: number, priceChange: number) => {
    // Simplified sensitivity calculation
    const rentImpact = (rentChange / 100) * 0.8 // 80% of rent change affects IRR
    const priceImpact = -(priceChange / 100) * 0.6 // Price increase reduces IRR
    return baseIRR + (rentImpact + priceImpact) * 100
  }

  const getColorForIRR = (irr: number) => {
    if (irr >= 12) return 'green.500'
    if (irr >= 8) return 'blue.500'
    if (irr >= 6) return 'yellow.500'
    return 'red.500'
  }

  return (
    <Box overflowX="auto">
      <ChakraText fontSize="sm" color="gray.600" mb={3}>
        IRR Sensitivity to Rent and Purchase Price Changes (%)
      </ChakraText>
      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th>Rent Change →<br />Price Change ↓</Th>
            {rentChanges.map(rent => (
              <Th key={rent} textAlign="center">{rent > 0 ? '+' : ''}{rent}%</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {priceChanges.map(price => (
            <Tr key={price}>
              <Th>{price > 0 ? '+' : ''}{price}%</Th>
              {rentChanges.map(rent => {
                const irr = calculateIRRSensitivity(rent, price)
                return (
                  <Td key={`${price}-${rent}`} textAlign="center">
                    <ChakraText 
                      color={getColorForIRR(irr)}
                      fontWeight={rent === 0 && price === 0 ? 'bold' : 'normal'}
                    >
                      {irr.toFixed(1)}%
                    </ChakraText>
                  </Td>
                )
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

interface DealResultsProps {
  analysis: DealAnalysis | null
  onReanalyze?: (DealInput) => void
}

export default function DealResults({ analysis, onReanalyze }: DealResultsProps) {
  if (!analysis) {
    return (
      <Box textAlign="center" py={8}>
        <ChakraText>No analysis data available</ChakraText>
      </Box>
    )
  }

  const { financialMetrics, aiAnalysis } = analysis

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  const gradeMetric = (metricType: string, value: number, numberOfUnits: number = 1) => {
    let grade = 'C'
    let color = 'yellow'
    let explanation = ''

    switch (metricType) {
      case 'cap_rate':
        if (value >= 8.0) { 
          grade = 'A+'; color = 'green'
          explanation = 'Excellent - High return relative to purchase price, indicates strong value or higher-risk market'
        }
        else if (value >= 7.0) { 
          grade = 'A'; color = 'green'
          explanation = 'Very Good - Above-market returns, solid investment fundamentals'
        }
        else if (value >= 6.0) { 
          grade = 'B'; color = 'blue'
          explanation = 'Good - Market-rate returns, stable investment in decent location'
        }
        else if (value >= 5.0) { 
          grade = 'C'; color = 'yellow'
          explanation = 'Fair - Below-market returns, may indicate premium location or need for improvement'
        }
        else { 
          grade = 'D'; color = 'red'
          explanation = 'Poor - Very low returns, likely overpriced or in declining market'
        }
        break
      case 'cash_on_cash':
        if (value >= 12) { 
          grade = 'A+'; color = 'green'
          explanation = 'Excellent - High cash returns on equity invested, strong cash flow property'
        }
        else if (value >= 10) { 
          grade = 'A'; color = 'green'
          explanation = 'Very Good - Strong cash returns, beats most alternative investments'
        }
        else if (value >= 8) { 
          grade = 'B'; color = 'blue'
          explanation = 'Good - Solid cash returns, competitive with stock market averages'
        }
        else if (value >= 6) { 
          grade = 'C'; color = 'yellow'
          explanation = 'Fair - Modest cash returns, may not justify real estate risk premium'
        }
        else { 
          grade = 'D'; color = 'red'
          explanation = 'Poor - Low cash returns, likely negative leverage or high expenses'
        }
        break
      case 'dscr':
        if (value >= 1.5) { 
          grade = 'A+'; color = 'green'
          explanation = 'Excellent - Very safe debt coverage, lenders love this ratio'
        }
        else if (value >= 1.35) { 
          grade = 'A'; color = 'green'
          explanation = 'Very Good - Strong debt coverage with good safety margin'
        }
        else if (value >= 1.25) { 
          grade = 'B'; color = 'blue'
          explanation = 'Good - Acceptable debt coverage, meets most lender requirements'
        }
        else if (value >= 1.15) { 
          grade = 'C'; color = 'yellow'
          explanation = 'Fair - Tight debt coverage, little room for income decline'
        }
        else { 
          grade = 'D'; color = 'red'
          explanation = 'Poor - Insufficient debt coverage, high risk of default'
        }
        break
      case 'irr':
        if (value >= 15) { 
          grade = 'A+'; color = 'green'
          explanation = 'Excellent - Outstanding total returns including appreciation'
        }
        else if (value >= 12) { 
          grade = 'A'; color = 'green'
          explanation = 'Very Good - Strong total returns, beats market benchmarks'
        }
        else if (value >= 10) { 
          grade = 'B'; color = 'blue'
          explanation = 'Good - Solid total returns, competitive with stock market'
        }
        else if (value >= 8) { 
          grade = 'C'; color = 'yellow'
          explanation = 'Fair - Modest total returns, may not justify real estate risks'
        }
        else { 
          grade = 'D'; color = 'red'
          explanation = 'Poor - Low total returns, likely losing to inflation'
        }
        break
      case 'equity_multiple':
        if (value >= 2.5) { 
          grade = 'A+'; color = 'green'
          explanation = 'Excellent - More than doubles invested capital over hold period'
        }
        else if (value >= 2.0) { 
          grade = 'A'; color = 'green'
          explanation = 'Very Good - Doubles invested capital, strong wealth building'
        }
        else if (value >= 1.75) { 
          grade = 'B'; color = 'blue'
          explanation = 'Good - Solid capital growth, beats most fixed income'
        }
        else if (value >= 1.5) { 
          grade = 'C'; color = 'yellow'
          explanation = 'Fair - Modest capital growth, limited wealth building'
        }
        else { 
          grade = 'D'; color = 'red'
          explanation = 'Poor - Minimal capital growth, may not beat inflation'
        }
        break
    }

    return { grade, color, explanation }
  }

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={4}>Deal Analysis Results</Heading>
          <ChakraText color="gray.600">Comprehensive analysis of your investment opportunity</ChakraText>
        </Box>

        {/* Grading Explanation */}
        <Box bg="blue.50" p={4} borderRadius="md" border="1px solid" borderColor="blue.200">
          <Heading size="sm" mb={3} color="blue.700">Metric Grading System</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <VStack align="start" spacing={1}>
              <ChakraText fontWeight="semibold" fontSize="sm">Excellent (A+/A)</ChakraText>
              <ChakraText fontSize="xs" color="gray.600">Top-tier investment metrics indicating strong value and returns</ChakraText>
            </VStack>
            <VStack align="start" spacing={1}>
              <ChakraText fontWeight="semibold" fontSize="sm">Good (B)</ChakraText>
              <ChakraText fontSize="xs" color="gray.600">Solid metrics meeting most investor requirements</ChakraText>
            </VStack>
            <VStack align="start" spacing={1}>
              <ChakraText fontWeight="semibold" fontSize="sm">Needs Review (C/D)</ChakraText>
              <ChakraText fontSize="xs" color="gray.600">Below-market performance requiring further analysis</ChakraText>
            </VStack>
          </SimpleGrid>
        </Box>

        {/* Key Metrics */}
        <Card>
          <CardBody>
            <Heading size="md" mb={6} color="gray.800">Key Financial Metrics</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
            <Stat>
              <StatLabel>Net Operating Income (NOI)</StatLabel>
              <StatNumber>{formatCurrency(financialMetrics.noi)}</StatNumber>
              <StatHelpText>
                <strong>Definition:</strong> Annual property income after all operating expenses but before debt service.<br/>
                <strong>Per Unit:</strong> {formatCurrency(financialMetrics.noi / analysis.dealInput.numberOfUnits)} per unit annually<br/>
                <strong>Real-world meaning:</strong> This is the actual cash the property generates to pay your mortgage and provide returns.
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>
                Going-In Cap Rate
                <Box as="span" ml={2} px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="bold" 
                     bg={`${gradeMetric('cap_rate', financialMetrics.goingInCapRate).color}.500`} color="white">
                  {gradeMetric('cap_rate', financialMetrics.goingInCapRate).grade}
                </Box>
              </StatLabel>
              <StatNumber>{formatPercentage(financialMetrics.goingInCapRate)}</StatNumber>
              <StatHelpText>
                <strong>Definition:</strong> NOI ÷ Purchase Price = unlevered annual return<br/>
                <strong>Interpretation:</strong> For every $100 invested, you earn ${(financialMetrics.goingInCapRate).toFixed(2)} annually before debt<br/>
                <strong>Grade Rationale:</strong> {gradeMetric('cap_rate', financialMetrics.goingInCapRate).explanation}
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>
                Cash-on-Cash Return
                <Box as="span" ml={2} px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="bold"
                     bg={`${gradeMetric('cash_on_cash', financialMetrics.cashOnCashReturn).color}.500`} color="white">
                  {gradeMetric('cash_on_cash', financialMetrics.cashOnCashReturn).grade}
                </Box>
              </StatLabel>
              <StatNumber>{formatPercentage(financialMetrics.cashOnCashReturn)}</StatNumber>
              <StatHelpText>
                <strong>Definition:</strong> Annual cash flow ÷ Total cash invested (down payment + costs)<br/>
                <strong>Interpretation:</strong> For every $100 of your own money, you receive ${(financialMetrics.cashOnCashReturn).toFixed(2)} annually<br/>
                <strong>Grade Rationale:</strong> {gradeMetric('cash_on_cash', financialMetrics.cashOnCashReturn).explanation}
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>
                Internal Rate of Return (IRR)
                <Box as="span" ml={2} px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="bold"
                     bg={`${gradeMetric('irr', financialMetrics.irr).color}.500`} color="white">
                  {gradeMetric('irr', financialMetrics.irr).grade}
                </Box>
              </StatLabel>
              <StatNumber>{formatPercentage(financialMetrics.irr)}</StatNumber>
              <StatHelpText>
                <strong>Definition:</strong> Total annualized return including cash flows + appreciation over hold period<br/>
                <strong>Interpretation:</strong> Your investment grows at {financialMetrics.irr.toFixed(1)}% per year (like compound interest)<br/>
                <strong>Grade Rationale:</strong> {gradeMetric('irr', financialMetrics.irr).explanation}
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>
                Equity Multiple
                <Box as="span" ml={2} px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="bold"
                     bg={`${gradeMetric('equity_multiple', financialMetrics.equityMultiple).color}.500`} color="white">
                  {gradeMetric('equity_multiple', financialMetrics.equityMultiple).grade}
                </Box>
              </StatLabel>
              <StatNumber>{financialMetrics.equityMultiple.toFixed(2)}x</StatNumber>
              <StatHelpText>
                <strong>Definition:</strong> Total cash returned (cash flows + sale proceeds) ÷ Initial investment<br/>
                <strong>Interpretation:</strong> You get back {financialMetrics.equityMultiple.toFixed(2)} times your original investment<br/>
                <strong>Grade Rationale:</strong> {gradeMetric('equity_multiple', financialMetrics.equityMultiple).explanation}
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>
                DSCR (Debt Service Coverage Ratio)
                <Box as="span" ml={2} px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="bold"
                     bg={`${gradeMetric('dscr', financialMetrics.dscr).color}.500`} color="white">
                  {gradeMetric('dscr', financialMetrics.dscr).grade}
                </Box>
              </StatLabel>
              <StatNumber>{financialMetrics.dscr.toFixed(2)}</StatNumber>
              <StatHelpText>
                <strong>Definition:</strong> NOI ÷ Annual debt payments = ability to service debt<br/>
                <strong>Interpretation:</strong> Property income covers debt payments {financialMetrics.dscr.toFixed(2)} times over<br/>
                <strong>Grade Rationale:</strong> {gradeMetric('dscr', financialMetrics.dscr).explanation}
              </StatHelpText>
            </Stat>
          </SimpleGrid>
          </CardBody>
        </Card>

        {/* Comprehensive Investment Summary */}
        <Box bg="gray.50" p={6} borderRadius="lg" border="2px solid" borderColor="gray.200">
          <Heading size="md" mb={6} textAlign="center">Overall Investment Summary</Heading>
          
          {/* Final Grade */}
          <VStack spacing={6}>
            <Box textAlign="center">
              <ChakraText fontSize="5xl" fontWeight="bold" 
                    color={aiAnalysis.summary.includes("STRONG BUY") ? "green.500" : 
                          aiAnalysis.summary.includes("BUY") ? "blue.500" : 
                          aiAnalysis.summary.includes("HOLD") ? "yellow.500" : "red.500"}>
                {aiAnalysis.summary.split("OVERALL GRADE: ")[1]?.split(" - ")[0] || "B+"}
              </ChakraText>
              <ChakraText fontSize="2xl" fontWeight="semibold" mt={2}
                    color={aiAnalysis.summary.includes("STRONG BUY") ? "green.600" : 
                          aiAnalysis.summary.includes("BUY") ? "blue.600" : 
                          aiAnalysis.summary.includes("HOLD") ? "yellow.600" : "red.600"}>
                {aiAnalysis.summary.split(" - ")[1]?.split(".")[0] || "CONDITIONAL BUY"}
              </ChakraText>
            </Box>

            {/* Investment Assessment */}
            <Box bg="white" p={6} borderRadius="md" w="100%" maxW="800px">
              <Heading size="sm" mb={4} color="gray.800">Investment Assessment</Heading>
              <VStack spacing={4} align="stretch">
                <Box>
                  <ChakraText fontWeight="semibold" mb={2}>Deal Viability:</ChakraText>
                  <ChakraText color="gray.700">
                    {(() => {
                      const avgGrade = (
                        (financialMetrics.goingInCapRate >= 6 ? 3 : 2) +
                        (financialMetrics.cashOnCashReturn >= 8 ? 3 : 2) +
                        (financialMetrics.irr >= 10 ? 3 : 2) +
                        (financialMetrics.dscr >= 1.25 ? 3 : 2)
                      ) / 4;
                      
                      if (avgGrade >= 2.8) {
                        return `This appears to be a solid investment opportunity with strong fundamentals. The property demonstrates ${financialMetrics.goingInCapRate.toFixed(1)}% cap rate and ${financialMetrics.cashOnCashReturn.toFixed(1)}% cash-on-cash return, indicating good value and cash flow potential.`
                      } else if (avgGrade >= 2.3) {
                        return `This is a moderate investment with acceptable returns but some areas of concern. While the metrics meet basic investment criteria, further analysis of market conditions and potential improvements may be warranted.`
                      } else {
                        return `This investment shows weak fundamentals that may not justify the risk. The returns are below market expectations and may not provide adequate compensation for real estate investment risks.`
                      }
                    })()}
                  </ChakraText>
                </Box>

                <Box>
                  <ChakraText fontWeight="semibold" mb={2}>Key Strengths:</ChakraText>
                  <VStack align="start" spacing={1}>
                    {financialMetrics.goingInCapRate >= 6 && (
                      <ChakraText fontSize="sm" color="green.600">✓ Strong cap rate indicates good value relative to market</ChakraText>
                    )}
                    {financialMetrics.cashOnCashReturn >= 8 && (
                      <ChakraText fontSize="sm" color="green.600">✓ Excellent cash-on-cash return provides strong cash flow</ChakraText>
                    )}
                    {financialMetrics.dscr >= 1.3 && (
                      <ChakraText fontSize="sm" color="green.600">✓ Strong DSCR indicates safe debt coverage</ChakraText>
                    )}
                    {financialMetrics.irr >= 12 && (
                      <ChakraText fontSize="sm" color="green.600">✓ High IRR suggests strong total returns</ChakraText>
                    )}
                    {financialMetrics.equityMultiple >= 2.0 && (
                      <ChakraText fontSize="sm" color="green.600">✓ Strong equity multiple shows good wealth building potential</ChakraText>
                    )}
                  </VStack>
                </Box>

                <Box>
                  <ChakraText fontWeight="semibold" mb={2">Areas Requiring Attention:</ChakraText>
                  <VStack align="start" spacing={1}>
                    {financialMetrics.goingInCapRate < 5 && (
                      <ChakraText fontSize="sm" color="red.600">⚠ Low cap rate may indicate overpriced property or premium location</ChakraText>
                    )}
                    {financialMetrics.cashOnCashReturn < 6 && (
                      <ChakraText fontSize="sm" color="red.600">⚠ Low cash-on-cash return may not justify equity risk</ChakraText>
                    )}
                    {financialMetrics.dscr < 1.25 && (
                      <ChakraText fontSize="sm" color="red.600">⚠ Tight DSCR creates vulnerability to income fluctuations</ChakraText>
                    )}
                    {financialMetrics.irr < 10 && (
                      <ChakraText fontSize="sm" color="red.600">⚠ Low IRR may not compensate for real estate risks</ChakraText>
                    )}
                    {analysis.dealInput.vacancyRate > 10 && (
                      <ChakraText fontSize="sm" color="red.600">⚠ High vacancy assumptions require market validation</ChakraText>
                    )}
                  </VStack>
                </Box>

                <Box>
                  <ChakraText fontWeight="semibold" mb={2}>Recommendation:</ChakraText>
                  <ChakraText color="gray.700" fontSize="lg">
                    {(() => {
                      const capGrade = gradeMetric('cap_rate', financialMetrics.goingInCapRate);
                      const cocGrade = gradeMetric('cash_on_cash', financialMetrics.cashOnCashReturn);
                      const irrGrade = gradeMetric('irr', financialMetrics.irr);
                      const dscrGrade = gradeMetric('dscr', financialMetrics.dscr);
                      
                      const strongMetrics = [capGrade, cocGrade, irrGrade, dscrGrade].filter(g => g.grade === 'A+' || g.grade === 'A').length;
                      const weakMetrics = [capGrade, cocGrade, irrGrade, dscrGrade].filter(g => g.grade === 'D' || g.grade === 'C').length;
                      
                      if (strongMetrics >= 3) {
                        return "PROCEED WITH CONFIDENCE - This deal shows strong fundamentals across multiple metrics. Consider negotiating any remaining terms and moving forward with due diligence."
                      } else if (strongMetrics >= 2 && weakMetrics <= 1) {
                        return "PROCEED WITH CAUTION - Good deal with room for improvement. Consider strategies to enhance weaker metrics before closing."
                      } else if (weakMetrics >= 2) {
                        return "REQUIRES SIGNIFICANT ANALYSIS - Multiple weak metrics suggest this deal may not meet investment criteria without substantial improvements or price reduction."
                      } else {
                        return "MODERATE OPPORTUNITY - Deal meets basic criteria but may not provide exceptional returns. Consider market alternatives."
                      }
                    })()}
                  </ChakraText>
                </Box>
              </VStack>
            </Box>
          </VStack>
        </Box>

        {/* Sensitivity Analysis */}
        {onReanalyze && (
          <SensitivityPanel
            originalDealInput={analysis.dealInput}
            originalMetrics={financialMetrics}
            onAnalysisUpdate={onReanalyze}
          />
        )}

        {/* AI Analysis */}
        <Box>
          <Heading size="md" mb={4}>AI Investment Analysis</Heading>

          <Box mb={4}>
            <ChakraText fontWeight="semibold" mb={2}>Summary</ChakraText>
            <ChakraText color="gray.700">{aiAnalysis.summary}</ChakraText>
          </Box>

          {aiAnalysis.redFlags.length > 0 && (
            <Box mb={4}>
              <ChakraText fontWeight="semibold" mb={2} color="red.600">Red Flags</ChakraText>
              <VStack align="stretch" spacing={2}>
                {aiAnalysis.redFlags.map((flag, index) => (
                  <Alert key={index} status="warning" variant="left-accent">
                    <AlertIcon />
                    {flag}
                  </Alert>
                ))}
              </VStack>
            </Box>
          )}

          {aiAnalysis.recommendations.length > 0 && (
            <Box>
              <ChakraText fontWeight="semibold" mb={2} color="green.600">Recommendations</ChakraText>
              <VStack align="stretch" spacing={2}>
                {aiAnalysis.recommendations.map((rec, index) => (
                  <Alert key={index} status="info" variant="left-accent">
                    <AlertIcon />
                    {rec}
                  </Alert>
                ))}
              </VStack>
            </Box>
          )}
        </Box>

        {/* Cash Flow Analysis */}
        <Box>
          <Heading size="md" mb={4}>Cash Flow Analysis</Heading>
          <VStack spacing={6} align="stretch">
            {/* Annual Cash Flow Chart */}
            <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="gray.200">
              <Heading size="sm" mb={4}>10-Year Cash Flow Projection</Heading>
              <CashFlowChart 
                initialCashFlow={financialMetrics.annualCashFlow}
                growth={3} // 3% annual growth assumption
              />
            </Box>

            {/* IRR Waterfall */}
            <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="gray.200">
              <Heading size="sm" mb={4}>IRR Components Breakdown</Heading>
              <IRRWaterfall 
                cashOnCash={financialMetrics.cashOnCashReturn}
                appreciation={financialMetrics.irr - financialMetrics.cashOnCashReturn}
                totalIRR={financialMetrics.irr}
              />
            </Box>

            {/* Sensitivity Table */}
            <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="gray.200">
              <Heading size="sm" mb={4}>Sensitivity Analysis Table</Heading>
              <SensitivityTable 
                baseCapRate={financialMetrics.goingInCapRate}
                baseIRR={financialMetrics.irr}
                baseCashOnCash={financialMetrics.cashOnCashReturn}
              />
            </Box>
          </VStack>
        </Box>

        {/* Action Buttons */}
        <HStack spacing={4} justify="center">
          <Button 
            colorScheme="brand" 
            size="lg"
            onClick={() => {
              const dataStr = JSON.stringify(analysis, null, 2)
              const dataBlob = new Blob([dataStr], {type: 'application/json'})
              const url = URL.createObjectURL(dataBlob)
              const link = document.createElement('a')
              link.href = url
              link.download = `deal-analysis-${new Date().toISOString().split('T')[0]}.json`
              link.click()
              URL.revokeObjectURL(url)
            }}
          >
            Export Analysis
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              // You could add a toast here
            }}
          >
            Copy Link
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.print()}
          >
            Print Report
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}