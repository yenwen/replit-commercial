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
  Text,
  Tooltip,
  HStack,
  Icon,
  SimpleGrid,
  Card,
  CardBody,
  FormHelperText
} from '@chakra-ui/react'
import { DealInput, PropertyType } from '@/types'
import { FiHome, FiInfo, FiDollarSign, FiUsers } from 'react-icons/fi'

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
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2} color="gray.800">Property Details</Heading>
          <Text color="gray.600" fontSize="lg">
            Let's start with the basics about your investment property
          </Text>
        </Box>

        <Card>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isRequired>
                <HStack spacing={2} mb={2}>
                  <Icon as={FiHome} color="brand.500" />
                  <FormLabel mb={0}>Property Type</FormLabel>
                  <Tooltip 
                    label="Different property types have different risk profiles and expected returns. Multifamily typically offers stable cash flow, while office/retail may have higher vacancy risk."
                    placement="top"
                  >
                    <Box>
                      <Icon as={FiInfo} color="gray.400" cursor="help" />
                    </Box>
                  </Tooltip>
                </HStack>
                <Select 
                  placeholder="Choose your property type"
                  value={data.propertyType || ''}
                  onChange={(e) => handleChange('propertyType', e.target.value as PropertyType)}
                  borderRadius="lg"
                  borderWidth="2px"
                >
                  <option value="multifamily">Multifamily (Apartments)</option>
                  <option value="office">Office Building</option>
                  <option value="retail">Retail/Shopping Center</option>
                  <option value="industrial">Industrial/Warehouse</option>
                  <option value="mixed-use">Mixed Use</option>
                </Select>
                <FormHelperText>Select the primary use of the property</FormHelperText>
              </FormControl>

              <FormControl>
                <HStack spacing={2} mb={2}>
                  <Icon as={FiHome} color="brand.500" />
                  <FormLabel mb={0}>Property Name</FormLabel>
                </HStack>
                <Input
                  value={data.propertyName || ''}
                  onChange={(e) => handleChange('propertyName', e.target.value)}
                  placeholder="e.g., Sunset Apartments or 123 Main St"
                  borderRadius="lg"
                  borderWidth="2px"
                />
                <FormHelperText>Optional - helps you identify this analysis later</FormHelperText>
              </FormControl>

              <FormControl isRequired>
                <HStack spacing={2} mb={2}>
                  <Icon as={FiDollarSign} color="brand.500" />
                  <FormLabel mb={0}>Purchase Price</FormLabel>
                  <Tooltip 
                    label="This is the total amount you'll pay to acquire the property, including any closing costs. This directly affects your return calculations and determines how much cash you'll need to invest."
                    placement="top"
                  >
                    <Box>
                      <Icon as={FiInfo} color="gray.400" cursor="help" />
                    </Box>
                  </Tooltip>
                </HStack>
                <NumberInput
                  value={data.purchasePrice || ''}
                  onChange={(_, value) => handleChange('purchasePrice', value)}
                  min={0}
                  precision={2}
                  step={1000}
                >
                  <NumberInputField 
                    placeholder="e.g., 1,500,000" 
                    borderRadius="lg"
                    borderWidth="2px"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormHelperText>Total acquisition cost in USD</FormHelperText>
              </FormControl>

              <FormControl isRequired>
                <HStack spacing={2} mb={2}>
                  <Icon as={FiUsers} color="brand.500" />
                  <FormLabel mb={0}>Number of Units</FormLabel>
                  <Tooltip 
                    label="Total rentable units in the property. For office/retail, count individual suites or spaces. More units typically mean more stable income but higher management complexity."
                    placement="top"
                  >
                    <Box>
                      <Icon as={FiInfo} color="gray.400" cursor="help" />
                    </Box>
                  </Tooltip>
                </HStack>
                <NumberInput
                  value={data.numberOfUnits || ''}
                  onChange={(_, value) => handleChange('numberOfUnits', value)}
                  min={1}
                  precision={0}
                  step={1}
                >
                  <NumberInputField 
                    placeholder="e.g., 24" 
                    borderRadius="lg"
                    borderWidth="2px"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormHelperText>Total rentable units or spaces</FormHelperText>
              </FormControl>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Helpful tip box */}
        <Box bg="blue.50" p={4} borderRadius="lg" border="1px solid" borderColor="blue.200">
          <HStack spacing={3}>
            <Icon as={FiInfo} color="blue.500" />
            <Box>
              <Text fontSize="sm" fontWeight="600" color="blue.800">Getting Started Tip</Text>
              <Text fontSize="sm" color="blue.700">
                Don't worry if you don't have exact numbers yet. You can always adjust these values later 
                using our sensitivity analysis tools to see how changes affect your returns.
              </Text>
            </Box>
          </HStack>
        </Box>
      </VStack>
    </Box>
  )
}