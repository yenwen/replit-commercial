'use client'

import { useState } from 'react'
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
  Text,
  SimpleGrid
} from '@chakra-ui/react'
import { DealInput, ExitAssumptions } from '@/types'

interface ExitStrategyStepProps {
  data: Partial<DealInput>
  onDataChange: (data: Partial<DealInput>) => void
}

export default function ExitStrategyStep({
  data,
  onDataChange
}: ExitStrategyStepProps) {
  const [exitAssumptions, setExitAssumptions] = useState<ExitAssumptions>(
    data.exitAssumptions || {
      holdPeriod: 5,
      exitCapRate: 6.5,
      annualAppreciation: 3.0,
      marketCapRate: 6.0
    }
  )

  const handleChange = (field: keyof ExitAssumptions, value: number) => {
    const updated = { ...exitAssumptions, [field]: value }
    setExitAssumptions(updated)
    onDataChange({ exitAssumptions: updated })
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={2}>Exit Strategy & Market Assumptions</Heading>
          <Text color="gray.600">Define your exit strategy and market assumptions</Text>
        </Box>

        <SimpleGrid columns={2} spacing={6}>
          <FormControl isRequired>
            <FormLabel>Hold Period (years)</FormLabel>
            <NumberInput
              value={exitAssumptions.holdPeriod}
              onChange={(_, value) => handleChange('holdPeriod', value)}
              min={1}
              max={30}
              precision={0}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Exit Cap Rate (%)</FormLabel>
            <NumberInput
              value={exitAssumptions.exitCapRate}
              onChange={(_, value) => handleChange('exitCapRate', value)}
              min={2}
              max={15}
              precision={1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Annual Appreciation (%)</FormLabel>
            <NumberInput
              value={exitAssumptions.annualAppreciation}
              onChange={(_, value) => handleChange('annualAppreciation', value)}
              min={-10}
              max={20}
              precision={1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Market Cap Rate (%)</FormLabel>
            <NumberInput
              value={exitAssumptions.marketCapRate}
              onChange={(_, value) => handleChange('marketCapRate', value)}
              min={2}
              max={15}
              precision={1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </SimpleGrid>

        <Box p={4} bg="blue.50" borderRadius="md">
          <Text fontSize="sm" color="blue.800">
            <strong>Tip:</strong> The exit cap rate should typically be higher than the going-in cap rate 
            to account for market risk and time value of money. Market cap rate helps benchmark your 
            assumptions against current market conditions.
          </Text>
        </Box>
      </VStack>
    </Box>
  )
} 