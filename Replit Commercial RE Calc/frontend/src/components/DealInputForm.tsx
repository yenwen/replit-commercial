'use client'

import { useState, useEffect } from 'react'
import { Box, Button, VStack, HStack, useToast } from '@chakra-ui/react'
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
  const toast = useToast()

  // Load saved progress on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('dealInputProgress')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData(parsedData)
        toast({
          title: 'Progress Restored',
          description: 'Your previous progress has been loaded',
          status: 'info',
          duration: 3000,
          isClosable: true,
        })
      } catch (error) {
        console.error('Error parsing saved data:', error)
      }
    }
  }, [toast])

  const handleStepData = (stepData: Partial<DealInput>) => {
    const updatedData = { ...formData, ...stepData }
    setFormData(updatedData)
    
    // Save to localStorage
    try {
      localStorage.setItem('dealInputProgress', JSON.stringify(updatedData))
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return !!(formData.propertyType && formData.purchasePrice && formData.numberOfUnits && 
                 formData.purchasePrice > 0 && formData.numberOfUnits > 0)
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

    console.log('Advancing to next step...')
    if (currentStep < 3) {
      const nextStep = currentStep + 1
      console.log('Moving to step:', nextStep)
      onStepChange(nextStep)
    } else {
      // Complete the form
      console.log('Completing form with data:', formData)
      
      // Ensure all required fields have default values
      const completeData: DealInput = {
        propertyType: formData.propertyType || 'multifamily',
        purchasePrice: formData.purchasePrice || 0,
        numberOfUnits: formData.numberOfUnits || 1,
        rentRoll: formData.rentRoll || [],
        vacancyRate: formData.vacancyRate || 5,
        operatingExpenses: formData.operatingExpenses || {
          propertyTax: 0,
          insurance: 0,
          utilities: 0,
          maintenance: 0,
          propertyManagement: 0,
          other: 0
        },
        capexBudget: formData.capexBudget || 0,
        loanTerms: formData.loanTerms || {
          ltv: 75,
          interestRate: 5.5,
          amortizationPeriod: 30,
          isInterestOnly: false,
          interestOnlyMonths: 0
        },
        exitAssumptions: formData.exitAssumptions || {
          holdPeriod: 5,
          exitCapRate: 6.5,
          annualAppreciation: 3.0,
          marketCapRate: 6.0
        }
      }
      
      console.log('Complete deal data:', completeData)
      onComplete(completeData)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1)
    }
  }

  const handleClearProgress = () => {
    if (window.confirm('Are you sure you want to clear all saved progress?')) {
      localStorage.removeItem('dealInputProgress')
      setFormData({})
      onStepChange(0)
      toast({
        title: 'Progress Cleared',
        description: 'All saved progress has been cleared',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
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
        <HStack spacing={2}>
          <Button
            onClick={handleBack}
            isDisabled={currentStep === 0}
            variant="outline"
          >
            Back
          </Button>
          <Button
            onClick={handleClearProgress}
            variant="ghost"
            colorScheme="red"
            size="sm"
          >
            Clear Progress
          </Button>
        </HStack>

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