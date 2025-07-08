
'use client'
import { useState, useEffect } from 'react'
import { Box, VStack, HStack, Heading, Text as ChakraText, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Alert, AlertIcon, Button, Table, Thead, Tbody, Tr, Th, Td, Card, CardBody, Spinner, Center } from '@chakra-ui/react'
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

// Dynamic imports for Recharts components
import dynamic from 'next/dynamic'
const DynamicCashFlowChart = dynamic(() => Promise.resolve(CashFlowChart), { ssr: false, loading: () => <Center h="300px"><Spinner /></Center> });
const DynamicIRRWaterfall = dynamic(() => Promise.resolve(IRRWaterfall), { ssr: false, loading: () => <Center h="250px"><Spinner /></Center> });
const DynamicSensitivityTable = dynamic(() => Promise.resolve(SensitivityTable), { ssr: false });
const DynamicResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false, loading: () => <Center h="300px"><Spinner /></Center> });
const DynamicLineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false });
const DynamicBarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), { ssr: false });
const DynamicTooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });

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
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])


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

    switch (metricType) {
      case 'cap_rate':
        if (value >= 8.0) { grade = 'A+'; color = 'green' }
        else if (value >= 7.0) { grade = 'A'; color = 'green' }
        else if (value >= 6.0) { grade = 'B'; color = 'blue' }
        else if (value >= 5.0) { grade = 'C'; color = 'yellow' }
        else { grade = 'D'; color = 'red' }
        break
      case 'cash_on_cash':
        if (value >= 12) { grade = 'A+'; color = 'green' }
        else if (value >= 10) { grade = 'A'; color = 'green' }
        else if (value >= 8) { grade = 'B'; color = 'blue' }
        else if (value >= 6) { grade = 'C'; color = 'yellow' }
        else { grade = 'D'; color = 'red' }
        break
      case 'dscr':
        if (value >= 1.5) { grade = 'A+'; color = 'green' }
        else if (value >= 1.35) { grade = 'A'; color = 'green' }
        else if (value >= 1.25) { grade = 'B'; color = 'blue' }
        else if (value >= 1.15) { grade = 'C'; color = 'yellow' }
        else { grade = 'D'; color = 'red' }
        break
      case 'irr':
        if (value >= 15) { grade = 'A+'; color = 'green' }
        else if (value >= 12) { grade = 'A'; color = 'green' }
        else if (value >= 10) { grade = 'B'; color = 'blue' }
        else if (value >= 8) { grade = 'C'; color = 'yellow' }
        else { grade = 'D'; color = 'red' }
        break
      case 'equity_multiple':
        if (value >= 2.5) { grade = 'A+'; color = 'green' }
        else if (value >= 2.0) { grade = 'A'; color = 'green' }
        else if (value >= 1.75) { grade = 'B'; color = 'blue' }
        else if (value >= 1.5) { grade = 'C'; color = 'yellow' }
        else { grade = 'D'; color = 'red' }
        break
    }

    return { grade, color }
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
              <StatLabel>Net Operating Income</StatLabel>
              <StatNumber>{formatCurrency(financialMetrics.noi)}</StatNumber>
              <StatHelpText>
                Annual NOI (Gross Income - Operating Expenses). This is the property's income after paying all operating costs but before debt service.
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
                NOI ÷ Purchase Price. For every $100 invested, you earn ${(financialMetrics.goingInCapRate).toFixed(2)} annually before debt service. 
                A 6% cap rate means the property pays for itself in ~16.7 years. Higher rates = better immediate returns or riskier areas.
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
                Annual Cash Flow ÷ Cash Invested. For every $100 of your own money invested, you receive ${(financialMetrics.cashOnCashReturn).toFixed(2)} 
                annually in cash flow. An 8% return means doubling your cash in 12.5 years through cash flow alone.
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>
                Internal Rate of Return
                <Box as="span" ml={2} px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="bold"
                     bg={`${gradeMetric('irr', financialMetrics.irr).color}.500`} color="white">
                  {gradeMetric('irr', financialMetrics.irr).grade}
                </Box>
              </StatLabel>
              <StatNumber>{formatPercentage(financialMetrics.irr)}</StatNumber>
              <StatHelpText>
                Your total annualized return including cash flows and sale proceeds. A 12% IRR means your investment grows at 12% per year - 
                like earning 12% annually in the stock market, but through real estate cash flow and appreciation.
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
                Total Cash Returned ÷ Initial Investment. Shows how many times you get your money back over the investment period.
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>
                DSCR
                <Box as="span" ml={2} px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="bold"
                     bg={`${gradeMetric('dscr', financialMetrics.dscr).color}.500`} color="white">
                  {gradeMetric('dscr', financialMetrics.dscr).grade}
                </Box>
              </StatLabel>
              <StatNumber>{financialMetrics.dscr.toFixed(2)}</StatNumber>
              <StatHelpText>
                NOI ÷ Annual Debt Service. Measures ability to service debt. Lenders typically require 1.20x+ for loan approval.
              </StatHelpText>
            </Stat>
          </SimpleGrid>
          </CardBody>
        </Card>

        {/* Overall Grade Section */}
        <Box bg="gray.50" p={6} borderRadius="lg" border="2px solid" borderColor="gray.200">
          <Heading size="md" mb={4} textAlign="center">Overall Investment Grade</Heading>
          <VStack spacing={4}>
            <Box textAlign="center">
              <ChakraText fontSize="4xl" fontWeight="bold" 
                    color={aiAnalysis.summary.includes("STRONG BUY") ? "green.500" : 
                          aiAnalysis.summary.includes("BUY") ? "blue.500" : 
                          aiAnalysis.summary.includes("HOLD") ? "yellow.500" : "red.500"}>
                {aiAnalysis.summary.split("OVERALL GRADE: ")[1]?.split(" - ")[0] || "N/A"}
              </ChakraText>
              <ChakraText fontSize="xl" fontWeight="semibold" mt={2}
                    color={aiAnalysis.summary.includes("STRONG BUY") ? "green.600" : 
                          aiAnalysis.summary.includes("BUY") ? "blue.600" : 
                          aiAnalysis.summary.includes("HOLD") ? "yellow.600" : "red.600"}>
                {aiAnalysis.summary.split(" - ")[1]?.split(".")[0] || "N/A"}
              </ChakraText>
            </Box>
            <Box textAlign="center" maxW="600px">
              <ChakraText color="gray.700" fontSize="lg">
                {aiAnalysis.summary.split(". ")[1]?.split(" Analysis:")[0] || "Investment analysis not available"}
              </ChakraText>
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
              <DynamicCashFlowChart 
                initialCashFlow={financialMetrics.annualCashFlow}
                growth={3} // 3% annual growth assumption
              />
            </Box>
            
            {/* IRR Waterfall */}
            <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="gray.200">
              <Heading size="sm" mb={4}>IRR Components Breakdown</Heading>
              <DynamicIRRWaterfall 
                cashOnCash={financialMetrics.cashOnCashReturn}
                appreciation={financialMetrics.irr - financialMetrics.cashOnCashReturn}
                totalIRR={financialMetrics.irr}
              />
            </Box>
            
            {/* Sensitivity Table */}
            <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="gray.200">
              <Heading size="sm" mb={4}>Sensitivity Analysis Table</Heading>
              <DynamicSensitivityTable 
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
              if (isClient) {
                const dataStr = JSON.stringify(analysis, null, 2)
                const dataBlob = new Blob([dataStr], {type: 'application/json'})
                const url = URL.createObjectURL(dataBlob)
                const link = document.createElement('a')
                link.href = url
                link.download = `deal-analysis-${new Date().toISOString().split('T')[0]}.json`
                link.click()
                URL.revokeObjectURL(url)
              }
            }}
            disabled={!isClient} // Disable button server-side
          >
            Export Analysis
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => {
              if (isClient) {
                navigator.clipboard.writeText(window.location.href)
                // You could add a toast here
              }
            }}
            disabled={!isClient} // Disable button server-side
          >
            Copy Link
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => { if (isClient) window.print() }}
            disabled={!isClient} // Disable button server-side
          >
            Print Report
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}
