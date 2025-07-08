'use client'

import { Box, VStack, HStack, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Alert, AlertIcon, Button } from '@chakra-ui/react'
import { DealAnalysis, DealInput } from '@/types'
import SensitivityPanel from './SensitivityPanel'

interface DealResultsProps {
  analysis: DealAnalysis | null
  onReanalyze?: (input: DealInput) => void
}

export default function DealResults({ analysis, onReanalyze }: DealResultsProps) {
  if (!analysis) {
    return (
      <Box textAlign="center" py={8}>
        <Text>No analysis data available</Text>
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
          <Text color="gray.600">Comprehensive analysis of your investment opportunity</Text>
        </Box>

        {/* Grading Explanation */}
        <Box bg="blue.50" p={4} borderRadius="md" border="1px solid" borderColor="blue.200">
          <Heading size="sm" mb={3} color="blue.700">Metric Grading System</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <VStack align="start" spacing={1}>
              <Text fontWeight="semibold" fontSize="sm">Excellent (A+/A)</Text>
              <Text fontSize="xs" color="gray.600">Top-tier investment metrics indicating strong value and returns</Text>
            </VStack>
            <VStack align="start" spacing={1}>
              <Text fontWeight="semibold" fontSize="sm">Good (B)</Text>
              <Text fontSize="xs" color="gray.600">Solid metrics meeting most investor requirements</Text>
            </VStack>
            <VStack align="start" spacing={1}>
              <Text fontWeight="semibold" fontSize="sm">Needs Review (C/D)</Text>
              <Text fontSize="xs" color="gray.600">Below-market performance requiring further analysis</Text>
            </VStack>
          </SimpleGrid>
        </Box>

        {/* Key Metrics */}
        <Box>
          <Heading size="md" mb={4}>Key Financial Metrics</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
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
        </Box>

        {/* Overall Grade Section */}
        <Box bg="gray.50" p={6} borderRadius="lg" border="2px solid" borderColor="gray.200">
          <Heading size="md" mb={4} textAlign="center">Overall Investment Grade</Heading>
          <VStack spacing={4}>
            <Box textAlign="center">
              <Text fontSize="4xl" fontWeight="bold" 
                    color={aiAnalysis.summary.includes("STRONG BUY") ? "green.500" : 
                          aiAnalysis.summary.includes("BUY") ? "blue.500" : 
                          aiAnalysis.summary.includes("HOLD") ? "yellow.500" : "red.500"}>
                {aiAnalysis.summary.split("OVERALL GRADE: ")[1]?.split(" - ")[0] || "N/A"}
              </Text>
              <Text fontSize="xl" fontWeight="semibold" mt={2}
                    color={aiAnalysis.summary.includes("STRONG BUY") ? "green.600" : 
                          aiAnalysis.summary.includes("BUY") ? "blue.600" : 
                          aiAnalysis.summary.includes("HOLD") ? "yellow.600" : "red.600"}>
                {aiAnalysis.summary.split(" - ")[1]?.split(".")[0] || "N/A"}
              </Text>
            </Box>
            <Box textAlign="center" maxW="600px">
              <Text color="gray.700" fontSize="lg">
                {aiAnalysis.summary.split(". ")[1]?.split(" Analysis:")[0] || "Investment analysis not available"}
              </Text>
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
            <Text fontWeight="semibold" mb={2}>Summary</Text>
            <Text color="gray.700">{aiAnalysis.summary}</Text>
          </Box>

          {aiAnalysis.redFlags.length > 0 && (
            <Box mb={4}>
              <Text fontWeight="semibold" mb={2} color="red.600">Red Flags</Text>
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
              <Text fontWeight="semibold" mb={2} color="green.600">Recommendations</Text>
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

        {/* Charts Placeholder */}
        <Box>
          <Heading size="md" mb={4}>Cash Flow Analysis</Heading>
          <Box p={8} bg="gray.50" borderRadius="md" textAlign="center">
            <Text color="gray.500">Charts will be implemented here</Text>
            <Text fontSize="sm" color="gray.400" mt={2}>
              Cash flow curves, IRR waterfall, and sensitivity tables
            </Text>
          </Box>
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