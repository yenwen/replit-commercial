'use client'

import { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
  Text,
  SimpleGrid,
  Select
} from '@chakra-ui/react'
import { DealInput, OperatingExpenses, LoanTerms } from '@/types'

interface ExpensesFinancingStepProps {
  data: Partial<DealInput>
  onDataChange: (data: Partial<DealInput>) => void
}

export default function ExpensesFinancingStep({
  data,
  onDataChange
}: ExpensesFinancingStepProps) {
  const [expenseMethod, setExpenseMethod] = useState<'percentage' | 'itemized'>('percentage')
  const [expensePercentage, setExpensePercentage] = useState(35)
  const [operatingExpenses, setOperatingExpenses] = useState<OperatingExpenses>(
    data.operatingExpenses || {
      propertyTax: 0,
      insurance: 0,
      utilities: 0,
      maintenance: 0,
      propertyManagement: 0,
      other: 0,
      total: 0
    }
  )
  const [loanTerms, setLoanTerms] = useState<LoanTerms>(
    data.loanTerms || {
      loanAmount: 0,
      ltv: 75,
      interestRate: 5.5,
      amortizationPeriod: 30,
      monthlyPayment: 0
    }
  )
  const [capexBudget, setCapexBudget] = useState(data.capexBudget || 0)

  const handleExpenseChange = (field: keyof OperatingExpenses, value: number) => {
    const updated = { ...operatingExpenses, [field]: value }
    const total = Object.keys(updated).reduce((sum, key) => {
      if (key !== 'total') {
        return sum + (updated[key as keyof OperatingExpenses] || 0)
      }
      return sum
    }, 0)
    updated.total = total
    setOperatingExpenses(updated)
    onDataChange({ operatingExpenses: updated, loanTerms, capexBudget })
  }

  const handleLoanChange = (field: keyof LoanTerms, value: number) => {
    const updated = { ...loanTerms, [field]: value }
    setLoanTerms(updated)
    onDataChange({ operatingExpenses, loanTerms: updated, capexBudget })
  }

  const handleCapexChange = (value: number) => {
    setCapexBudget(value)
    onDataChange({ operatingExpenses, loanTerms, capexBudget: value })
  }

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="md" mb={2}>Operating Expenses</Heading>
          <Text color="gray.600">Enter operating expenses and financing details</Text>
        </Box>

        <FormControl>
          <FormLabel>Expense Input Method</FormLabel>
          <Select
            value={expenseMethod}
            onChange={(e) => setExpenseMethod(e.target.value as 'percentage' | 'itemized')}
          >
            <option value="percentage">As % of Gross Income</option>
            <option value="itemized">Itemized Expenses</option>
          </Select>
        </FormControl>

        {expenseMethod === 'percentage' ? (
          <FormControl>
            <FormLabel>Operating Expenses (% of Gross Income)</FormLabel>
            <NumberInput
              value={expensePercentage}
              onChange={(_, value) => setExpensePercentage(value)}
              min={0}
              max={100}
              precision={1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        ) : (
          <SimpleGrid columns={2} spacing={4}>
            <FormControl>
              <FormLabel>Property Tax ($/year)</FormLabel>
              <NumberInput
                value={operatingExpenses.propertyTax}
                onChange={(_, value) => handleExpenseChange('propertyTax', value)}
                min={0}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Insurance ($/year)</FormLabel>
              <NumberInput
                value={operatingExpenses.insurance}
                onChange={(_, value) => handleExpenseChange('insurance', value)}
                min={0}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Utilities ($/year)</FormLabel>
              <NumberInput
                value={operatingExpenses.utilities}
                onChange={(_, value) => handleExpenseChange('utilities', value)}
                min={0}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Maintenance ($/year)</FormLabel>
              <NumberInput
                value={operatingExpenses.maintenance}
                onChange={(_, value) => handleExpenseChange('maintenance', value)}
                min={0}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Property Management ($/year)</FormLabel>
              <NumberInput
                value={operatingExpenses.propertyManagement}
                onChange={(_, value) => handleExpenseChange('propertyManagement', value)}
                min={0}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Other ($/year)</FormLabel>
              <NumberInput
                value={operatingExpenses.other}
                onChange={(_, value) => handleExpenseChange('other', value)}
                min={0}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </SimpleGrid>
        )}

        <Box>
          <Heading size="sm" mb={4}>Financing</Heading>
          <SimpleGrid columns={2} spacing={4}>
            <FormControl>
              <FormLabel>Loan-to-Value (%)</FormLabel>
              <NumberInput
                value={loanTerms.ltv}
                onChange={(_, value) => handleLoanChange('ltv', value)}
                min={0}
                max={100}
                precision={1}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Interest Rate (%)</FormLabel>
              <NumberInput
                value={loanTerms.interestRate}
                onChange={(_, value) => handleLoanChange('interestRate', value)}
                min={0}
                max={20}
                precision={2}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Amortization Period (years)</FormLabel>
              <NumberInput
                value={loanTerms.amortizationPeriod}
                onChange={(_, value) => handleLoanChange('amortizationPeriod', value)}
                min={1}
                max={50}
                precision={0}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </SimpleGrid>
        </Box>

        <FormControl>
          <FormLabel>CapEx Budget ($)</FormLabel>
          <NumberInput
            value={capexBudget}
            onChange={(_, value) => handleCapexChange(value)}
            min={0}
            precision={0}
          >
            <NumberInputField placeholder="Enter CapEx budget" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </VStack>
    </Box>
  )
} 