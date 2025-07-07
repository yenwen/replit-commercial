'use client'

import { Box, VStack, HStack, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Alert, AlertIcon, Button } from '@chakra-ui/react'
import { DealAnalysis } from '@/types'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

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

  // Generate cash flow projection data
  const generateCashFlowData = () => {
    const years = Array.from({ length: 10 }, (_, i) => `Year ${i + 1}`)
    const cashFlows = years.map((_, i) => {
      const baseFlow = financialMetrics.noi * (1 + 0.03) ** i // 3% annual growth
      const debtService = analysis.dealInput.loanTerms.loanAmount * (analysis.dealInput.loanTerms.interestRate / 100) * 1.2 // Approx annual debt service
      return baseFlow - debtService
    })

    return {
      labels: years,
      datasets: [
        {
          label: 'Annual Cash Flow',
          data: cashFlows,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
        },
      ],
    }
  }

  // Generate IRR waterfall data
  const generateIRRWaterfallData = () => {
    const components = ['Initial Investment', 'Annual Cash Flow', 'Tax Benefits', 'Appreciation', 'Total Return']
    const downPayment = analysis.dealInput.purchasePrice - analysis.dealInput.loanTerms.loanAmount
    const values = [
      -downPayment,
      financialMetrics.noi * 5 * 0.7, // 5 years of 70% cash flow
      downPayment * 0.15, // Estimated tax benefits
      analysis.dealInput.purchasePrice * 0.03 * 5, // 5 years of 3% appreciation
      0, // Will be calculated
    ]
    values[4] = values.slice(0, 4).reduce((sum, val) => sum + val, 0)

    return {
      labels: components,
      datasets: [
        {
          label: 'IRR Components ($)',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
          ],
        },
      ],
    }
  }

  // Generate expense breakdown data
  const generateExpenseBreakdownData = () => {
    const expenses = analysis.dealInput.operatingExpenses
    const breakdownLabels = ['Property Tax', 'Insurance', 'Management', 'Maintenance', 'Utilities', 'Other']
    const breakdownValues = [
      expenses.propertyTax,
      expenses.insurance,
      expenses.propertyManagement,
      expenses.maintenance,
      expenses.utilities,
      expenses.other,
    ]

    return {
      labels: breakdownLabels,
      datasets: [
        {
          data: breakdownValues,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
        },
      ],
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value)
          },
        },
      },
    },
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

        {/* Charts Section */}
        <Box>
          <Heading size="md" mb={6}>Cash Flow Analysis & Charts</Heading>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
            {/* Cash Flow Projection Chart */}
            <Box bg="white" p={6} borderRadius="md" boxShadow="sm" border="1px solid" borderColor="gray.200">
              <Heading size="sm" mb={4}>10-Year Cash Flow Projection</Heading>
              <Box height="300px">
                <Line data={generateCashFlowData()} options={chartOptions} />
              </Box>
            </Box>

            {/* IRR Waterfall Chart */}
            <Box bg="white" p={6} borderRadius="md" boxShadow="sm" border="1px solid" borderColor="gray.200">
              <Heading size="sm" mb={4}>IRR Components Waterfall</Heading>
              <Box height="300px">
                <Bar data={generateIRRWaterfallData()} options={chartOptions} />
              </Box>
            </Box>
          </SimpleGrid>

          {/* Expense Breakdown Chart */}
          <Box bg="white" p={6} borderRadius="md" boxShadow="sm" border="1px solid" borderColor="gray.200" mb={6}>
            <Heading size="sm" mb={4}>Operating Expense Breakdown</Heading>
            <Box height="300px" display="flex" justifyContent="center">
              <Box width="400px">
                <Doughnut 
                  data={generateExpenseBreakdownData()} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right' as const,
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Sensitivity Table */}
          <Box bg="white" p={6} borderRadius="md" boxShadow="sm" border="1px solid" borderColor="gray.200">
            <Heading size="sm" mb={4}>Sensitivity Analysis</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Box>
                <Text fontWeight="semibold" mb={2}>Cap Rate Sensitivity</Text>
                <VStack align="stretch" spacing={1}>
                  <HStack justify="space-between">
                    <Text fontSize="sm">5.5%</Text>
                    <Text fontSize="sm" color="green.600">+{formatPercentage(2.5)}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">6.0%</Text>
                    <Text fontSize="sm" color="green.600">+{formatPercentage(1.2)}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">6.5%</Text>
                    <Text fontSize="sm">Base Case</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">7.0%</Text>
                    <Text fontSize="sm" color="red.600">-{formatPercentage(1.8)}</Text>
                  </HStack>
                </VStack>
              </Box>

              <Box>
                <Text fontWeight="semibold" mb={2}>NOI Growth Sensitivity</Text>
                <VStack align="stretch" spacing={1}>
                  <HStack justify="space-between">
                    <Text fontSize="sm">5%</Text>
                    <Text fontSize="sm" color="green.600">+{formatPercentage(3.2)}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">3%</Text>
                    <Text fontSize="sm">Base Case</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">1%</Text>
                    <Text fontSize="sm" color="red.600">-{formatPercentage(2.1)}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">0%</Text>
                    <Text fontSize="sm" color="red.600">-{formatPercentage(4.5)}</Text>
                  </HStack>
                </VStack>
              </Box>

              <Box>
                <Text fontWeight="semibold" mb={2}>Vacancy Rate Impact</Text>
                <VStack align="stretch" spacing={1}>
                  <HStack justify="space-between">
                    <Text fontSize="sm">5%</Text>
                    <Text fontSize="sm" color="green.600">+{formatPercentage(1.8)}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">10%</Text>
                    <Text fontSize="sm">Base Case</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">15%</Text>
                    <Text fontSize="sm" color="red.600">-{formatPercentage(1.5)}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">20%</Text>
                    <Text fontSize="sm" color="red.600">-{formatPercentage(3.2)}</Text>
                  </HStack>
                </VStack>
              </Box>
            </SimpleGrid>
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