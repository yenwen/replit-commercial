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
    await analyzeDeal(input)
    setIsAnalyzing(false)
  }

  const analyzeDeal = async (input: DealInput) => {
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
        const errorData = await response.text()
        console.error('API error response:', errorData)
        throw new Error(`API returned ${response.status}`)
      }

      const result = await response.json()
      console.log('Analysis result:', result)

      setAnalysis(result)
      setCurrentStep(4) // Move to results step

    } catch (error) {
      console.error('Error analyzing deal:', error)
      // You might want to show an error message to the user here
    }
  }

  const handleStepChange = (step: number) => {
    console.log('Step change requested from', currentStep, 'to', step)
    setCurrentStep(step)
  }

  return (
    <Box>
      {/* Progress Stepper - Hide on mobile when in results */}
      <Box display={{ base: currentStep >= 4 ? 'none' : 'block', md: 'block' }}>
        <Stepper 
          index={activeStep} 
          mb={8} 
          orientation={{ base: 'vertical', md: 'horizontal' }}
          height={{ base: 'auto', md: 'auto' }}
          gap={{ base: 4, md: 0 }}
        >
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator 
                bg={activeStep >= index ? 'brand.500' : 'gray.200'}
                borderColor={activeStep >= index ? 'brand.500' : 'gray.300'}
              >
                <StepStatus
                  complete={<StepIcon color="white" />}
                  incomplete={<StepNumber color="gray.500" />}
                  active={<StepNumber color="white" />}
                />
              </StepIndicator>
              <Box flexShrink='0' ml={{ base: 4, md: 0 }}>
                <StepTitle 
                  fontSize={{ base: 'sm', md: 'md' }}
                  color={activeStep >= index ? 'brand.600' : 'gray.500'}
                >
                  {step.title}
                </StepTitle>
              </Box>
              <StepSeparator />
            </Step>
          ))}
        </Stepper>
      </Box>

      <VStack spacing={8} align="stretch">
        {currentStep < 4 ? (
          <DealInputForm
            currentStep={currentStep}
            onStepChange={handleStepChange}
            onComplete={handleDealInputComplete}
            isAnalyzing={isAnalyzing}
          />
        ) : (
          <DealResults analysis={analysis} onReanalyze={analyzeDeal} />
        )}
      </VStack>

      {/* Loading Overlay */}
      {isAnalyzing && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(255, 255, 255, 0.9)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="overlay"
        >
          <VStack spacing={4}>
            <Box
              w="16"
              h="16"
              border="4px solid"
              borderColor="gray.200"
              borderTopColor="brand.500"
              borderRadius="full"
              animation="spin 1s linear infinite"
            />
            <VStack spacing={2} textAlign="center">
              <Text fontSize="lg" fontWeight="600" color="gray.800">
                Analyzing Your Deal
              </Text>
              <Text fontSize="sm" color="gray.600" maxW="xs">
                Our AI is crunching the numbers and generating your investment analysis...
              </Text>
            </VStack>
          </VStack>
        </Box>
      )}
    </Box>
  )
}