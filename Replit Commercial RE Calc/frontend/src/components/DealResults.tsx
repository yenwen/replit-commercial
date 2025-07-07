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

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={4}>Deal Analysis Results</Heading>
          <Text color="gray.600">Comprehensive analysis of your investment opportunity</Text>
        </Box>

        {/* Key Metrics */}
        <Box>
          <Heading size="md" mb={4}>Key Financial Metrics</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            <Stat>
              <StatLabel>Net Operating Income</StatLabel>
              <StatNumber>{formatCurrency(financialMetrics.noi)}</StatNumber>
              <StatHelpText>Annual NOI</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Going-In Cap Rate</StatLabel>
              <StatNumber>{formatPercentage(financialMetrics.goingInCapRate)}</StatNumber>
              <StatHelpText>NOI / Purchase Price</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Cash-on-Cash Return</StatLabel>
              <StatNumber>{formatPercentage(financialMetrics.cashOnCashReturn)}</StatNumber>
              <StatHelpText>Year 1 return</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Internal Rate of Return</StatLabel>
              <StatNumber>{formatPercentage(financialMetrics.irr)}</StatNumber>
              <StatHelpText>Projected IRR</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Equity Multiple</StatLabel>
              <StatNumber>{financialMetrics.equityMultiple.toFixed(2)}x</StatNumber>
              <StatHelpText>Total return multiple</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>DSCR</StatLabel>
              <StatNumber>{financialMetrics.dscr.toFixed(2)}</StatNumber>
              <StatHelpText>Debt Service Coverage</StatHelpText>
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
          <Button colorScheme="brand" size="lg">
            Export PDF Report
          </Button>
          <Button variant="outline" size="lg">
            Save Deal
          </Button>
          <Button variant="outline" size="lg">
            Share Analysis
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
} 