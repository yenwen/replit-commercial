'use client'

import { useState } from 'react'
import { Box, VStack, useSteps, Step, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper } from '@chakra-ui/react'
import DealInputForm from './DealInputForm'
import DealResults from './DealResults'
import { DealInput, DealAnalysis } from '@/types'

const steps = [
  { title: 'Property Details' },
  { title: 'Rent Roll' },
  { title: 'Expenses & Financing' },
  { title: 'Exit Strategy' },
  { title: 'Analysis Results' }
]

export default function DealAnalyzer() {
  const [dealInput, setDealInput] = useState<DealInput | null>(null)
  const [analysis, setAnalysis] = useState<DealAnalysis | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const { activeStep } = useSteps({
    index: currentStep,
    count: steps.length,
  })

  const handleDealInputComplete = async (input: DealInput) => {
    console.log('Starting deal analysis with input:', input)
    setDealInput(input)
    setIsAnalyzing(true)
    
    try {
      // Call backend API to analyze deal
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/analyze-deal'
        : `${window.location.protocol}//${window.location.hostname}:5000/api/analyze-deal`
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })
      
      console.log('API response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Analysis result:', result)
        setAnalysis(result)
        setCurrentStep(4) // Move to results step
      } else {
        const errorText = await response.text()
        console.error('API error response:', errorText)
        throw new Error(`Failed to analyze deal: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('Error analyzing deal:', error)
      // TODO: Show error toast
      alert(`Error analyzing deal: ${error.message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleStepChange = (step: number) => {
    console.log('Step change requested from', currentStep, 'to', step)
    setCurrentStep(step)
  }

  return (
    <Box>
      <Stepper index={activeStep} mb={8}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink='0'>
              <StepTitle>{step.title}</StepTitle>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <VStack spacing={8} align="stretch">
        {currentStep < 4 ? (
          <DealInputForm
            currentStep={currentStep}
            onStepChange={handleStepChange}
            onComplete={handleDealInputComplete}
            isAnalyzing={isAnalyzing}
          />
        ) : (
          <DealResults analysis={analysis} />
        )}
      </VStack>
    </Box>
  )
}
'use client'

import { useState } from 'react'
import { Box, VStack, HStack, Heading, Progress, Text, useToast } from '@chakra-ui/react'
import DealInputForm from './DealInputForm'
import DealResults from './DealResults'
import { DealInput, DealAnalysis } from '@/types'

const steps = [
  'Property Details',
  'Rent Roll',
  'Expenses & Financing',
  'Exit Strategy'
]

export default function DealAnalyzer() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<DealAnalysis | null>(null)
  const toast = useToast()

  const handleStepChange = (step: number) => {
    console.log('Step change requested from', currentStep, 'to', step)
    setCurrentStep(step)
  }

  const handleComplete = async (dealInput: DealInput) => {
    setIsAnalyzing(true)
    
    try {
      const response = await fetch('/api/analyze-deal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dealInput),
      })

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`)
      }

      const result: DealAnalysis = await response.json()
      setAnalysis(result)
      
      toast({
        title: 'Analysis Complete',
        description: 'Your deal analysis is ready!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      // Clear saved progress after successful analysis
      localStorage.removeItem('dealInputProgress')
      
    } catch (error) {
      console.error('Analysis error:', error)
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleStartOver = () => {
    setCurrentStep(0)
    setAnalysis(null)
    localStorage.removeItem('dealInputProgress')
    toast({
      title: 'Reset Complete',
      description: 'Starting a new analysis',
      status: 'info',
      duration: 2000,
      isClosable: true,
    })
  }

  if (analysis) {
    return (
      <Box>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between" align="center">
            <Heading size="lg">Deal Analysis Results</Heading>
            <button
              onClick={handleStartOver}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Start New Analysis
            </button>
          </HStack>
          <DealResults analysis={analysis} />
        </VStack>
      </Box>
    )
  }

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        {/* Progress Indicator */}
        <Box>
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" fontWeight="medium">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </Text>
          </HStack>
          <Progress 
            value={((currentStep + 1) / steps.length) * 100} 
            colorScheme="brand"
            size="sm"
            borderRadius="full"
          />
        </Box>

        {/* Step Navigation */}
        <HStack spacing={4} justify="center">
          {steps.map((step, index) => (
            <Box
              key={index}
              px={3}
              py={1}
              borderRadius="full"
              bg={index === currentStep ? 'brand.500' : index < currentStep ? 'brand.100' : 'gray.100'}
              color={index === currentStep ? 'white' : index < currentStep ? 'brand.600' : 'gray.500'}
              fontSize="xs"
              fontWeight="medium"
              cursor={index < currentStep ? 'pointer' : 'default'}
              onClick={() => index < currentStep && handleStepChange(index)}
            >
              {index + 1}
            </Box>
          ))}
        </HStack>

        {/* Form */}
        <DealInputForm
          currentStep={currentStep}
          onStepChange={handleStepChange}
          onComplete={handleComplete}
          isAnalyzing={isAnalyzing}
        />
      </VStack>
    </Box>
  )
}
