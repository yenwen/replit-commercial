'use client'

import { useState } from 'react'
import { Box, VStack, HStack, Heading, Progress, Text, useToast, Stepper, Step, StepIndicator, StepStatus, StepIcon, StepNumber, StepTitle, StepSeparator } from '@chakra-ui/react'
import DealInputForm from './DealInputForm'
import DealResults from './DealResults'
import { DealInput, DealAnalysis } from '@/types'

const steps = [
  { title: 'Property Details' },
  { title: 'Rent Roll' },
  { title: 'Expenses & Financing' },
  { title: 'Exit Strategy' },
  { title: 'Results' }
]

export default function DealAnalyzer() {
  const [currentStep, setCurrentStep] = useState(0)
  const [dealInput, setDealInput] = useState<DealInput | null>(null)
  const [analysis, setAnalysis] = useState<DealAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const toast = useToast()

  const activeStep = analysis ? 4 : currentStep

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

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error response:', errorText)
        throw new Error(`Failed to analyze deal: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log('Analysis result:', result)
      setAnalysis(result)
      setCurrentStep(4) // Move to results step

      toast({
        title: 'Analysis Complete',
        description: 'Your deal has been successfully analyzed',
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

  const handleStepChange = (step: number) => {
    console.log('Step change requested from', currentStep, 'to', step)
    setCurrentStep(step)
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