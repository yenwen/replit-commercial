'use client'

import {
  Box,
  VStack,
  HStack,
  Heading,
  Text as ChakraText,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  SimpleGrid,
  Card,
  CardBody,
  Tooltip,
  Icon,
  Flex,
  Badge,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'
import { FiInfo, FiHome, FiDollarSign, FiUsers } from 'react-icons/fi'
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
      <VStack spacing={8} align="stretch">
        {/* Header Section */}
        <Box textAlign="center">
          <Heading size="lg" mb={3} color="gray.800">
            Property Details
          </Heading>
          <ChakraText color="gray.600" fontSize="lg" maxW="2xl" mx="auto">
            Let's start with the basics about your investment property. 
            This information will form the foundation of your analysis.
          </ChakraText>
        </Box>

        {/* Main Form Card */}
        <Card>
          <CardBody p={{ base: 6, md: 8 }}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {/* Property Type */}
              <FormControl>
                <Flex align="center" mb={2}>
                  <Icon as={FiHome} mr={2} color="brand.500" />
                  <FormLabel mb={0} fontWeight="semibold">
                    Property Type
                  </FormLabel>
                  <Tooltip 
                    label="Different property types have varying risk profiles and market expectations"
                    hasArrow
                    placement="top"
                  >
                    <Box ml={2} cursor="help">
                      <Icon as={FiInfo} color="gray.400" boxSize={4} />
                    </Box>
                  </Tooltip>
                </Flex>
                <Select
                  placeholder="Select property type"
                  value={data.propertyType || ''}
                  onChange={(e) => handleChange('propertyType', e.target.value as PropertyType)}
                  size="lg"
                  bg="white"
                >
                  <option value="multifamily">Multifamily (Apartments)</option>
                  <option value="office">Office Building</option>
                  <option value="retail">Retail/Shopping Center</option>
                  <option value="mixed-use">Mixed-Use Development</option>
                </Select>
                <FormHelperText>
                  Choose the primary use of your investment property
                </FormHelperText>
              </FormControl>

              {/* Number of Units */}
              <FormControl>
                <Flex align="center" mb={2}>
                  <Icon as={FiUsers} mr={2} color="brand.500" />
                  <FormLabel mb={0} fontWeight="semibold">
                    Number of Units
                  </FormLabel>
                  <Tooltip 
                    label="Total rentable units in the property. For office/retail, use number of leasable spaces"
                    hasArrow
                    placement="top"
                  >
                    <Box ml={2} cursor="help">
                      <Icon as={FiInfo} color="gray.400" boxSize={4} />
                    </Box>
                  </Tooltip>
                </Flex>
                <NumberInput
                  value={data.numberOfUnits?.toString() || ''}
                  onChange={(_, value) => handleChange('numberOfUnits', value || 0)}
                  min={1}
                  max={1000}
                  size="lg"
                >
                  <NumberInputField bg="white" placeholder="e.g., 24" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormHelperText>
                  Enter the total number of rentable units
                </FormHelperText>
              </FormControl>

              {/* Purchase Price */}
              <FormControl>
                <Flex align="center" mb={2}>
                  <Icon as={FiDollarSign} mr={2} color="brand.500" />
                  <FormLabel mb={0} fontWeight="semibold">
                    Purchase Price
                  </FormLabel>
                  <Tooltip 
                    label="Total acquisition cost including the property purchase price, but excluding closing costs and immediate improvements"
                    hasArrow
                    placement="top"
                  >
                    <Box ml={2} cursor="help">
                      <Icon as={FiInfo} color="gray.400" boxSize={4} />
                    </Box>
                  </Tooltip>
                </Flex>
                <NumberInput
                  value={data.purchasePrice || ''}
                  onChange={(_, value) => handleChange('purchasePrice', value || 0)}
                  min={0}
                  size="lg"
                  format={(val) => `$${val.toLocaleString()}`}
                  parse={(val) => parseInt(val.replace(/\$|,/g, '')) || 0}
                >
                  <NumberInputField bg="white" placeholder="e.g., $2,500,000" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormHelperText>
                  {data.purchasePrice && data.numberOfUnits ? (
                    <ChakraText color="green.600" fontWeight="medium">
                      Price per unit: ${((data.purchasePrice || 0) / (data.numberOfUnits || 1)).toLocaleString()}
                    </ChakraText>
                  ) : (
                    'Enter the total property acquisition price'
                  )}
                </FormHelperText>
              </FormControl>

              {/* Vacancy Rate */}
              <FormControl>
                <Flex align="center" mb={2}>
                  <FormLabel mb={0} fontWeight="semibold">
                    Vacancy Rate
                  </FormLabel>
                  <Tooltip 
                    label="Expected average vacancy percentage. Market average for multifamily is typically 5-8%"
                    hasArrow
                    placement="top"
                  >
                    <Box ml={2} cursor="help">
                      <Icon as={FiInfo} color="gray.400" boxSize={4} />
                    </Box>
                  </Tooltip>
                </Flex>
                <NumberInput
                  value={data.vacancyRate?.toString() || ''}
                  onChange={(_, value) => handleChange('vacancyRate', value || 0)}
                  min={0}
                  max={50}
                  precision={1}
                  step={0.5}
                  size="lg"
                >
                  <NumberInputField bg="white" placeholder="e.g., 5.0" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormHelperText>
                  Percentage of units expected to be vacant (0-50%)
                </FormHelperText>
              </FormControl>
            </SimpleGrid>

            {/* Property Type Badge and Quick Stats */}
            {data.propertyType && (
              <Box mt={8} p={6} bg="gray.50" borderRadius="xl">
                <HStack justify="space-between" flexWrap="wrap" gap={4}>
                  <VStack align="start" spacing={1}>
                    <ChakraText fontSize="sm" color="gray.600" fontWeight="medium">
                      Property Type
                    </ChakraText>
                    <Badge colorScheme="brand" size="lg" px={3} py={1} borderRadius="full">
                      {data.propertyType.charAt(0).toUpperCase() + data.propertyType.slice(1)}
                    </Badge>
                  </VStack>

                  {data.numberOfUnits && (
                    <VStack align="start" spacing={1}>
                      <ChakraText fontSize="sm" color="gray.600" fontWeight="medium">
                        Units
                      </ChakraText>
                      <ChakraText fontSize="xl" fontWeight="bold" color="gray.800">
                        {data.numberOfUnits.toLocaleString()}
                      </ChakraText>
                    </VStack>
                  )}

                  {data.purchasePrice && (
                    <VStack align="start" spacing={1}>
                      <ChakraText fontSize="sm" color="gray.600" fontWeight="medium">
                        Total Price
                      </ChakraText>
                      <ChakraText fontSize="xl" fontWeight="bold" color="gray.800">
                        ${(data.purchasePrice / 1000000).toFixed(1)}M
                      </ChakraText>
                    </VStack>
                  )}

                  {data.vacancyRate && (
                    <VStack align="start" spacing={1}>
                      <ChakraText fontSize="sm" color="gray.600" fontWeight="medium">
                        Vacancy
                      </ChakraText>
                      <ChakraText fontSize="xl" fontWeight="bold" color="gray.800">
                        {data.vacancyRate}%
                      </ChakraText>
                    </VStack>
                  )}
                </HStack>
              </Box>
            )}
          </CardBody>
        </Card>

        {/* Helper Information */}
        <Card bg="blue.50" borderColor="blue.200">
          <CardBody>
            <HStack spacing={3} align="start">
              <Icon as={FiInfo} color="blue.500" mt={1} />
              <Box>
                <ChakraText fontWeight="semibold" color="blue.800" mb={2}>
                  💡 Getting Started Tips
                </ChakraText>
                <VStack align="start" spacing={2}>
                  <ChakraText fontSize="sm" color="blue.700">
                    • <strong>Property Type:</strong> Choose the category that represents the majority of your income
                  </ChakraText>
                  <ChakraText fontSize="sm" color="blue.700">
                    • <strong>Purchase Price:</strong> Include the base property price, but exclude closing costs and immediate CapEx
                  </ChakraText>
                  <ChakraText fontSize="sm" color="blue.700">
                    • <strong>Vacancy Rate:</strong> Conservative estimates help ensure realistic projections
                  </ChakraText>
                </VStack>
              </Box>
            </HStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  )
}