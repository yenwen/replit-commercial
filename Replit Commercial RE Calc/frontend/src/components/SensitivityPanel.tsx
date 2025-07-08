'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SimpleGrid,
  Badge,
  Collapse,
  Button,
  useDisclosure
} from '@chakra-ui/react'
import { DealInput, FinancialMetrics } from '@/types'

interface SensitivityPanelProps {
  originalDealInput: DealInput
  originalMetrics: FinancialMetrics
  onAnalysisUpdate: (input: DealInput) => void
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(value)
}

export default function SensitivityPanel({
  originalDealInput,
  originalMetrics,
  onAnalysisUpdate
}: SensitivityPanelProps) {
  const { isOpen, onToggle } = useDisclosure()

  // Sensitivity adjustments (as percentages)
  const [adjustments, setAdjustments] = useState({
    purchasePrice: 0,
    monthlyRent: 0,
    vacancyRate: 0,
    operatingExpenses: 0,
    interestRate: 0,
    exitCapRate: 0
  })

  // Calculate adjusted metrics in real-time
  const [adjustedInput, setAdjustedInput] = useState<DealInput>(originalDealInput)

  useEffect(() => {
    const adjusted = { ...originalDealInput }

    // Adjust purchase price
    adjusted.purchasePrice = originalDealInput.purchasePrice * (1 + adjustments.purchasePrice / 100)

    // Adjust rent roll
    adjusted.rentRoll = originalDealInput.rentRoll.map(unit => ({
      ...unit,
      monthlyRent: unit.monthlyRent * (1 + adjustments.monthlyRent / 100)
    }))

    // Adjust vacancy rate
    adjusted.vacancyRate = Math.max(0, Math.min(50, originalDealInput.vacancyRate + adjustments.vacancyRate))

    // Adjust operating expenses
    const expenseMultiplier = (1 + adjustments.operatingExpenses / 100)
    adjusted.operatingExpenses = {
      ...originalDealInput.operatingExpenses,
      propertyTax: originalDealInput.operatingExpenses.propertyTax * expenseMultiplier,
      insurance: originalDealInput.operatingExpenses.insurance * expenseMultiplier,
      utilities: originalDealInput.operatingExpenses.utilities * expenseMultiplier,
      maintenance: originalDealInput.operatingExpenses.maintenance * expenseMultiplier,
      propertyManagement: originalDealInput.operatingExpenses.propertyManagement * expenseMultiplier,
      other: originalDealInput.operatingExpenses.other * expenseMultiplier,
      total: originalDealInput.operatingExpenses.total * expenseMultiplier
    }

    // Adjust interest rate
    adjusted.loanTerms = {
      ...originalDealInput.loanTerms,
      interestRate: Math.max(1, Math.min(15, originalDealInput.loanTerms.interestRate + adjustments.interestRate))
    }

    // Adjust exit cap rate
    adjusted.exitAssumptions = {
      ...originalDealInput.exitAssumptions,
      exitCapRate: Math.max(3, Math.min(12, originalDealInput.exitAssumptions.exitCapRate + adjustments.exitCapRate))
    }

    setAdjustedInput(adjusted)
  }, [adjustments, originalDealInput])

  const handleAdjustment = (key: keyof typeof adjustments, value: number) => {
    setAdjustments(prev => ({ ...prev, [key]: value }))
  }

  const resetAdjustments = () => {
    setAdjustments({
      purchasePrice: 0,
      monthlyRent: 0,
      vacancyRate: 0,
      operatingExpenses: 0,
      interestRate: 0,
      exitCapRate: 0
    })
  }

  const applyAdjustments = () => {
    onAnalysisUpdate(adjustedInput)
  }

  const gradeMetric = (metricType: string, value: number) => {
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
      case 'irr':
        if (value >= 15) { grade = 'A+'; color = 'green' }
        else if (value >= 12) { grade = 'A'; color = 'green' }
        else if (value >= 10) { grade = 'B'; color = 'blue' }
        else if (value >= 8) { grade = 'C'; color = 'yellow' }
        else { grade = 'D'; color = 'red' }
        break
    }

    return { grade, color }
  }

  // Quick metrics calculation for preview
  const calculateQuickMetrics = (input: DealInput) => {
    const totalRent = input.rentRoll.reduce((sum, unit) => sum + (unit.occupied ? unit.monthlyRent : 0), 0) * 12
    const effectiveGrossIncome = totalRent * (1 - input.vacancyRate / 100)
    const totalExpenses = input.operatingExpenses.total
    const noi = effectiveGrossIncome - totalExpenses
    const goingInCapRate = (noi / input.purchasePrice) * 100

    // Simplified cash-on-cash (assuming 25% down, 5.5% rate if not adjusted)
    const downPayment = input.purchasePrice * 0.25
    const loanAmount = input.purchasePrice * 0.75
    const monthlyPayment = (loanAmount * (input.loanTerms.interestRate / 100 / 12)) / (1 - Math.pow(1 + (input.loanTerms.interestRate / 100 / 12), -360))
    const annualDebtService = monthlyPayment * 12
    const cashFlow = noi - annualDebtService
    const cashOnCash = (cashFlow / downPayment) * 100

    // Simplified IRR estimate
    const simpleIRR = cashOnCash + 2 // Rough approximation

    return { goingInCapRate, cashOnCash, irr: simpleIRR }
  }

  const previewMetrics = calculateQuickMetrics(adjustedInput)

  const updateAdjustment = (key: string, value: number) => {
    setAdjustments(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleReanalyze = () => {
    onAnalysisUpdate(adjustedInput)
  }

  return (
    <Box bg="blue.50" p={6} borderRadius="lg" border="2px solid" borderColor="blue.200">
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between" align="center">
          <Box>
            <Heading size="md" color="blue.700">Sensitivity Analysis</Heading>
            <Text fontSize="sm" color="gray.600">
              Adjust key variables to see how they impact your deal grades
            </Text>
          </Box>
          <Button onClick={onToggle} variant="outline" colorScheme="blue">
            {isOpen ? 'Hide Controls' : 'Show Controls'}
          </Button>
        </HStack>

        {/* Quick Metrics Preview */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Box textAlign="center" p={3} bg="white" borderRadius="md">
            <Text fontSize="sm" fontWeight="semibold">Cap Rate</Text>
            <HStack justify="center" spacing={2}>
              <Text fontSize="lg" fontWeight="bold">
                {previewMetrics.goingInCapRate.toFixed(2)}%
              </Text>
              <Badge colorScheme={gradeMetric('cap_rate', previewMetrics.goingInCapRate).color}>
                {gradeMetric('cap_rate', previewMetrics.goingInCapRate).grade}
              </Badge>
            </HStack>
          </Box>

          <Box textAlign="center" p={3} bg="white" borderRadius="md">
            <Text fontSize="sm" fontWeight="semibold">Cash-on-Cash</Text>
            <HStack justify="center" spacing={2}>
              <Text fontSize="lg" fontWeight="bold">
                {previewMetrics.cashOnCash.toFixed(2)}%
              </Text>
              <Badge colorScheme={gradeMetric('cash_on_cash', previewMetrics.cashOnCash).color}>
                {gradeMetric('cash_on_cash', previewMetrics.cashOnCash).grade}
              </Badge>
            </HStack>
          </Box>

          <Box textAlign="center" p={3} bg="white" borderRadius="md">
            <Text fontSize="sm" fontWeight="semibold">Est. IRR</Text>
            <HStack justify="center" spacing={2}>
              <Text fontSize="lg" fontWeight="bold">
                {previewMetrics.irr.toFixed(2)}%
              </Text>
              <Badge colorScheme={gradeMetric('irr', previewMetrics.irr).color}>
                {gradeMetric('irr', previewMetrics.irr).grade}
              </Badge>
            </HStack>
          </Box>
        </SimpleGrid>

        <Collapse in={isOpen} animateOpacity>
          <VStack spacing={6} align="stretch" mt={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {/* Purchase Price Adjustment */}
              <Box>
                <Text fontWeight="semibold" mb={2}>Purchase Price</Text>
                <Text fontSize="sm" color="gray.600" mb={3}>
                  Current: {formatCurrency(originalDealInput.purchasePrice)}
                </Text>
                <Slider
                  value={adjustments.purchasePrice}
                  onChange={(value) => updateAdjustment('purchasePrice', value)}
                  min={-20}
                  max={20}
                  step={1}
                  colorScheme="blue"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={4} />
                </Slider>
                <HStack justify="space-between" mt={1}>
                  <Text fontSize="xs">-20%</Text>
                  <Text fontSize="sm" fontWeight="bold">
                    {adjustments.purchasePrice > 0 ? '+' : ''}{adjustments.purchasePrice}%
                  </Text>
                  <Text fontSize="xs">+20%</Text>
                </HStack>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Adjusted: {formatCurrency(adjustedInput.purchasePrice)}
                </Text>
              </Box>
              {/* Monthly Rent Adjustment */}
              <Box>
                <Text fontWeight="semibold" mb={2}>Monthly Rent</Text>
                <Text fontSize="sm" color="gray.600" mb={3}>
                  Current: {formatCurrency(originalDealInput.rentRoll.reduce((sum, unit) => sum + unit.monthlyRent, 0))}
                </Text>
                <Slider
                  value={adjustments.monthlyRent}
                  onChange={(value) => updateAdjustment('monthlyRent', value)}
                  min={-20}
                  max={20}
                  step={1}
                  colorScheme="green"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={4} />
                </Slider>
                <HStack justify="space-between" mt={1}>
                  <Text fontSize="xs">-20%</Text>
                  <Text fontSize="sm" fontWeight="bold">
                    {adjustments.monthlyRent > 0 ? '+' : ''}{adjustments.monthlyRent}%
                  </Text>
                  <Text fontSize="xs">+20%</Text>
                </HStack>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Adjusted: {formatCurrency(adjustedInput.rentRoll.reduce((sum, unit) => sum + unit.monthlyRent, 0))}
                </Text>
              </Box>

              {/* Operating Expenses */}
              <Box>
                <Text fontWeight="semibold" mb={2}>Operating Expenses</Text>
                <Text fontSize="sm" color="gray.600" mb={3}>
                  Current: {formatCurrency(originalDealInput.operatingExpenses || 0)}
                </Text>
                <Slider
                  value={adjustments.operatingExpenses}
                  onChange={(value) => updateAdjustment('operatingExpenses', value)}
                  min={-20}
                  max={20}
                  step={1}
                  colorScheme="red"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={4} />
                </Slider>
                <HStack justify="space-between" mt={1}>
                  <Text fontSize="xs">-20%</Text>
                  <Text fontSize="sm" fontWeight="bold">
                    {adjustments.operatingExpenses > 0 ? '+' : ''}{adjustments.operatingExpenses}%
                  </Text>
                  <Text fontSize="xs">+20%</Text>
                </HStack>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Adjusted: {formatCurrency((originalDealInput.operatingExpenses || 0) * (1 + adjustments.operatingExpenses / 100))}
                </Text>
              </Box>

              {/* Interest Rate */}
              <Box>
                <Text fontWeight="semibold" mb={2}>Interest Rate</Text>
                <Text fontSize="sm" color="gray.600" mb={3}>
                  Current: {(originalDealInput.interestRate || 0).toFixed(2)}%
                </Text>
                <Slider
                  value={adjustments.interestRate}
                  onChange={(value) => updateAdjustment('interestRate', value)}
                  min={-2}
                  max={3}
                  step={0.25}
                  colorScheme="orange"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={4} />
                </Slider>
                <HStack justify="space-between" mt={1}>
                  <Text fontSize="xs">-2%</Text>
                  <Text fontSize="sm" fontWeight="bold">
                    {adjustments.interestRate > 0 ? '+' : ''}{adjustments.interestRate.toFixed(2)}%
                  </Text>
                  <Text fontSize="xs">+3%</Text>
                </HStack>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Adjusted: {((originalDealInput.interestRate || 0) + adjustments.interestRate).toFixed(2)}%
                </Text>
              </Box>

              {/* Exit Cap Rate */}
              <Box>
                <Text fontWeight="semibold" mb={2}>Exit Cap Rate</Text>
                <Text fontSize="sm" color="gray.600" mb={3}>
                  Current: {(originalDealInput.exitCapRate || 0).toFixed(2)}%
                </Text>
                <Slider
                  value={adjustments.exitCapRate}
                  onChange={(value) => updateAdjustment('exitCapRate', value)}
                  min={-2}
                  max={3}
                  step={0.25}
                  colorScheme="purple"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={4} />
                </Slider>
                <HStack justify="space-between" mt={1}>
                  <Text fontSize="xs">-2%</Text>
                  <Text fontSize="sm" fontWeight="bold">
                    {adjustments.exitCapRate > 0 ? '+' : ''}{adjustments.exitCapRate.toFixed(2)}%
                  </Text>
                  <Text fontSize="xs">+3%</Text>
                </HStack>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Adjusted: {((originalDealInput.exitCapRate || 0) + adjustments.exitCapRate).toFixed(2)}%
                </Text>
              </Box>
            </SimpleGrid>

            {/* Reanalyze Button */}
            <Box textAlign="center" mt={6}>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={handleReanalyze}
                disabled={Object.values(adjustments).every(val => val === 0)}
              >
                Reanalyze with Adjustments
              </Button>
              <Text fontSize="sm" color="gray.500" mt={2}>
                Click to see how your adjustments affect the deal grades
              </Text>
            </Box>
          </VStack>
        </Collapse>
      </VStack>
    </Box>
  )
}