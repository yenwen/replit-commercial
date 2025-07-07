'use client'

import { useEffect } from 'react'
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
  Text
} from '@chakra-ui/react'
import { DealInput, PropertyType } from '@/types'

interface PropertyDetailsStepProps {
  data: Partial<DealInput>
  onDataChange: (data: Partial<DealInput>) => void
}

export default function PropertyDetailsStep({
  data,
  onDataChange
}: PropertyDetailsStepProps) {
  const handleChange = (field: keyof DealInput, value: any) => {
    onDataChange({ [field]: value })
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={2}>Property Details</Heading>
          <Text color="gray.600">Enter the basic information about your property</Text>
        </Box>

        <FormControl isRequired>
          <FormLabel>Property Type</FormLabel>
          <Select
            value={data.propertyType || ''}
            onChange={(e) => handleChange('propertyType', e.target.value as PropertyType)}
            placeholder="Select property type"
          >
            <option value="multifamily">Multifamily</option>
            <option value="office">Office</option>
            <option value="retail">Retail</option>
            <option value="mixed-use">Mixed-Use</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Purchase Price ($)</FormLabel>
          <NumberInput
            value={data.purchasePrice || ''}
            onChange={(_, value) => handleChange('purchasePrice', value)}
            min={0}
            precision={0}
          >
            <NumberInputField placeholder="Enter purchase price" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Number of Units</FormLabel>
          <NumberInput
            value={data.numberOfUnits || ''}
            onChange={(_, value) => handleChange('numberOfUnits', value)}
            min={1}
            precision={0}
          >
            <NumberInputField placeholder="Enter number of units" />
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