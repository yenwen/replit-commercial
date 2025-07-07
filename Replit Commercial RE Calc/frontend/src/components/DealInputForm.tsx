'use client'

import { useState } from 'react'
import { Box, Button, VStack, HStack } from '@chakra-ui/react'
import PropertyDetailsStep from './steps/PropertyDetailsStep'
import RentRollStep from './steps/RentRollStep'
import ExpensesFinancingStep from './steps/ExpensesFinancingStep'
import ExitStrategyStep from './steps/ExitStrategyStep'
import { DealInput } from '@/types'

interface DealInputFormProps {
  currentStep: number
  onStepChange: (step: number) => void
  onComplete: (input: DealInput) => void
  isAnalyzing: boolean
}

export default function DealInputForm({
  currentStep,
  onStepChange,
  onComplete,
  isAnalyzing
}: DealInputFormProps) {
  const [formData, setFormData] = useState<Partial<DealInput>>({})

  const handleStepData = (stepData: Partial<DealInput>) => {
    setFormData(prev => ({ ...prev, ...stepData }))
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.propertyType && formData.purchasePrice && formData.numberOfUnits
      case 1:
        return true // Rent roll can be empty initially
      case 2:
        return true // Expenses can have defaults
      case 3:
        return true // Exit strategy can have defaults
      default:
        return false
    }
  }

  const handleNext = () => {
    console.log('Next button clicked, current step:', currentStep)
    console.log('Form data:', formData)
    console.log('Is step valid:', isStepValid())

    if (!isStepValid()) {
      console.log('Step validation failed')
      return
    }

    if (currentStep < 3) {
      onStepChange(currentStep + 1)
    } else {
      // Complete the form
      const completeData = formData as DealInput
      onComplete(completeData)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PropertyDetailsStep
            data={formData}
            onDataChange={handleStepData}
          />
        )
      case 1:
        return (
          <RentRollStep
            data={formData}
            onDataChange={handleStepData}
          />
        )
      case 2:
        return (
          <ExpensesFinancingStep
            data={formData}
            onDataChange={handleStepData}
          />
        )
      case 3:
        return (
          <ExitStrategyStep
            data={formData}
            onDataChange={handleStepData}
          />
        )
      default:
        return null
    }
  }

  return (
    <Box>
      {renderStep()}
      
      <HStack spacing={4} justify="space-between" mt={8}>
        <Button
          onClick={handleBack}
          isDisabled={currentStep === 0}
          variant="outline"
        >
          Back
        </Button>
        
        <Button
          onClick={handleNext}
          colorScheme="brand"
          isLoading={isAnalyzing}
          loadingText="Analyzing..."
          isDisabled={!isStepValid()}
        >
          {currentStep === 3 ? 'Analyze Deal' : 'Next'}
        </Button>
      </HStack>
    </Box>
  )
}