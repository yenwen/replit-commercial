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