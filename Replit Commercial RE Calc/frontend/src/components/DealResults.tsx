'use client'

import { Box, VStack, HStack, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Alert, AlertIcon, Button } from '@chakra-ui/react'
import { DealAnalysis } from '@/types'

interface DealResultsProps {
  analysis: DealAnalysis | null
}

export default function DealResults({ analysis }: DealResultsProps) {
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
                NOI ÷ Purchase Price. Measures the unlevered yield on your investment. Higher cap rates indicate better value or higher risk markets.
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
                Annual Cash Flow ÷ Initial Cash Investment. Shows the return on your actual cash invested, accounting for leverage effects.
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
                The annualized effective return rate including cash flows and exit proceeds. Accounts for time value of money over the hold period.
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