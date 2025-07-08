'use client'

import { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast
} from '@chakra-ui/react'
import { useDropzone } from 'react-dropzone'
import { DealInput, RentRollUnit } from '@/types'

interface RentRollStepProps {
  data: Partial<DealInput>
  onDataChange: (data: Partial<DealInput>) => void
}

export default function RentRollStep({
  data,
  onDataChange
}: RentRollStepProps) {
  const [rentRoll, setRentRoll] = useState<RentRollUnit[]>(data.rentRoll || [])
  const [vacancyRate, setVacancyRate] = useState(data.vacancyRate || 0)
  const [showBulkAdd, setShowBulkAdd] = useState(false)
  const [bulkData, setBulkData] = useState({
    count: 1,
    unitType: 'Standard',
    bedrooms: 1,
    bathrooms: 1,
    squareFootage: 0,
    monthlyRent: 0,
    occupied: true
  })
  const toast = useToast()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    onDrop: async (acceptedFiles) => {
      try {
        // TODO: Implement file parsing logic
        toast({
          title: 'File uploaded',
          description: 'Rent roll data will be processed',
          status: 'success',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to process file',
          status: 'error',
        })
      }
    }
  })

  const addUnit = () => {
    const newUnit: RentRollUnit = {
      unitNumber: `Unit ${rentRoll.length + 1}`,
      unitType: 'Standard',
      bedrooms: 1,
      bathrooms: 1,
      squareFootage: 0,
      monthlyRent: 0,
      occupied: true
    }
    const updatedRentRoll = [...rentRoll, newUnit]
    setRentRoll(updatedRentRoll)
    onDataChange({ rentRoll: updatedRentRoll, vacancyRate })
  }

  const addBulkUnits = () => {
    const newUnits: RentRollUnit[] = []
    for (let i = 0; i < bulkData.count; i++) {
      newUnits.push({
        unitNumber: `Unit ${rentRoll.length + i + 1}`,
        unitType: bulkData.unitType,
        bedrooms: bulkData.bedrooms,
        bathrooms: bulkData.bathrooms,
        squareFootage: bulkData.squareFootage,
        monthlyRent: bulkData.monthlyRent,
        occupied: bulkData.occupied
      })
    }
    const updatedRentRoll = [...rentRoll, ...newUnits]
    setRentRoll(updatedRentRoll)
    onDataChange({ rentRoll: updatedRentRoll, vacancyRate })
    setShowBulkAdd(false)
    setBulkData({
      count: 1,
      unitType: 'Standard',
      bedrooms: 1,
      bathrooms: 1,
      squareFootage: 0,
      monthlyRent: 0,
      occupied: true
    })
    toast({
      title: 'Units added',
      description: `Added ${bulkData.count} units successfully`,
      status: 'success',
    })
  }

  const removeUnit = (index: number) => {
    const updatedRentRoll = rentRoll.filter((_, i) => i !== index)
    setRentRoll(updatedRentRoll)
    onDataChange({ rentRoll: updatedRentRoll, vacancyRate })
  }

  const updateUnit = (index: number, field: keyof RentRollUnit, value: any) => {
    const updatedRentRoll = rentRoll.map((unit, i) => 
      i === index ? { ...unit, [field]: value } : unit
    )
    setRentRoll(updatedRentRoll)
    onDataChange({ rentRoll: updatedRentRoll, vacancyRate })
  }

  const handleVacancyRateChange = (value: number) => {
    setVacancyRate(value)
    onDataChange({ rentRoll, vacancyRate: value })
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={2}>Rent Roll & Vacancy</Heading>
          <Text color="gray.600">Upload rent roll data or enter manually</Text>
        </Box>

        <Box
          {...getRootProps()}
          border="2px dashed"
          borderColor={isDragActive ? "brand.500" : "gray.300"}
          borderRadius="md"
          p={6}
          textAlign="center"
          cursor="pointer"
          _hover={{ borderColor: "brand.500" }}
        >
          <input {...getInputProps()} />
          <Text>
            {isDragActive
              ? "Drop the files here..."
              : "Drag & drop rent roll files here, or click to select"}
          </Text>
          <Text fontSize="sm" color="gray.500" mt={2}>
            Supports CSV, XLSX, XLS
          </Text>
        </Box>

        <FormControl>
          <FormLabel>Vacancy Rate (%)</FormLabel>
          <NumberInput
            value={vacancyRate?.toString() || ''}
            onChange={(_, value) => handleVacancyRateChange(value || 0)}
            min={0}
            max={100}
            precision={1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <Box>
          <HStack justify="space-between" mb={4}>
            <Text fontWeight="semibold">Rent Roll Units</Text>
            <HStack spacing={2}>
              <Button variant="outline" size="sm" onClick={() => setShowBulkAdd(!showBulkAdd)}>
                + Bulk Add
              </Button>
              <Button colorScheme="brand" size="sm" onClick={addUnit}>
                + Add Unit
              </Button>
            </HStack>
          </HStack>

          {showBulkAdd && (
            <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={4} mb={4}>
              <Text fontWeight="semibold" mb={3}>Bulk Add Units</Text>
              <VStack spacing={3} align="stretch">
                <HStack spacing={4}>
                  <FormControl flex="1">
                    <FormLabel fontSize="sm">Number of Units</FormLabel>
                    <NumberInput
                      value={bulkData.count?.toString() || ''}
                      onChange={(_, value) => setBulkData(prev => ({ ...prev, count: value || 1 }))}
                      min={1}
                      size="sm"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl flex="1">
                    <FormLabel fontSize="sm">Unit Type</FormLabel>
                    <input
                      value={bulkData.unitType}
                      onChange={(e) => setBulkData(prev => ({ ...prev, unitType: e.target.value }))}
                      style={{ 
                        padding: '4px 8px', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '4px',
                        fontSize: '14px',
                        width: '100%'
                      }}
                      placeholder="e.g., 1BR, 2BR, Studio"
                    />
                  </FormControl>
                </HStack>
                <HStack spacing={4}>
                  <FormControl flex="1">
                    <FormLabel fontSize="sm">Bedrooms</FormLabel>
                    <NumberInput
                      value={bulkData.bedrooms?.toString() || ''}
                      onChange={(_, value) => setBulkData(prev => ({ ...prev, bedrooms: value || 0 }))}
                      min={0}
                      precision={1}
                      step={0.5}
                      size="sm"
                    >
                      <NumberInputField placeholder="e.g., 2.5" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl flex="1">
                    <FormLabel fontSize="sm">Bathrooms</FormLabel>
                    <NumberInput
                      value={bulkData.bathrooms?.toString() || ''}
                      onChange={(_, value) => setBulkData(prev => ({ ...prev, bathrooms: value || 0 }))}
                      min={0}
                      precision={1}
                      step={0.5}
                      size="sm"
                    >
                      <NumberInputField placeholder="e.g., 1.5" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </HStack>
                <HStack spacing={4}>
                  <FormControl flex="1">
                    <FormLabel fontSize="sm">Square Footage</FormLabel>
                    <NumberInput
                      value={bulkData.squareFootage?.toString() || ''}
                      onChange={(_, value) => setBulkData(prev => ({ ...prev, squareFootage: value || 0 }))}
                      min={0}
                      precision={1}
                      step={0.5}
                      size="sm"
                    >
                      <NumberInputField placeholder="e.g., 850.5" />
                    </NumberInput>
                  </FormControl>
                  <FormControl flex="1">
                    <FormLabel fontSize="sm">Monthly Rent</FormLabel>
                    <NumberInput
                      value={bulkData.monthlyRent?.toString() || ''}
                      onChange={(_, value) => setBulkData(prev => ({ ...prev, monthlyRent: value || 0 }))}
                      min={0}
                      precision={2}
                      step={0.25}
                      size="sm"
                    >
                      <NumberInputField placeholder="e.g., 1250.75" />
                    </NumberInput>
                  </FormControl>
                </HStack>
                <HStack justify="space-between" align="center">
                  <HStack>
                    <Text fontSize="sm">Occupied:</Text>
                    <input
                      type="checkbox"
                      checked={bulkData.occupied}
                      onChange={(e) => setBulkData(prev => ({ ...prev, occupied: e.target.checked }))}
                    />
                  </HStack>
                  <HStack spacing={2}>
                    <Button size="sm" variant="ghost" onClick={() => setShowBulkAdd(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" colorScheme="brand" onClick={addBulkUnits}>
                      Add {bulkData.count} Units
                    </Button>
                  </HStack>
                </HStack>
              </VStack>
            </Box>
          )}

          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Unit</Th>
                  <Th>Type</Th>
                  <Th>Bed</Th>
                  <Th>Bath</Th>
                  <Th>Sq Ft</Th>
                  <Th>Rent</Th>
                  <Th>Occupied</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rentRoll.map((unit, index) => (
                  <Tr key={index}>
                    <Td>
                      <input
                        value={unit.unitNumber}
                        onChange={(e) => updateUnit(index, 'unitNumber', e.target.value)}
                        style={{ 
                          width: '80px',
                          padding: '4px 8px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </Td>
                    <Td>
                      <input
                        value={unit.unitType}
                        onChange={(e) => updateUnit(index, 'unitType', e.target.value)}
                        style={{ 
                          width: '100px',
                          padding: '4px 8px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </Td>
                    <Td>
                      <NumberInput
                        value={unit.bedrooms}
                        onChange={(_, value) => updateUnit(index, 'bedrooms', value)}
                        min={0}
                        size="sm"
                      >
                        <NumberInputField />
                      </NumberInput>
                    </Td>
                    <Td>
                      <NumberInput
                        value={unit.bathrooms}
                        onChange={(_, value) => updateUnit(index, 'bathrooms', value)}
                        min={0}
                        size="sm"
                      >
                        <NumberInputField />
                      </NumberInput>
                    </Td>
                    <Td>
                      <NumberInput
                        value={unit.squareFootage}
                        onChange={(_, value) => updateUnit(index, 'squareFootage', value)}
                        min={0}
                        size="sm"
                      >
                        <NumberInputField />
                      </NumberInput>
                    </Td>
                    <Td>
                      <NumberInput
                        value={unit.monthlyRent}
                        onChange={(_, value) => updateUnit(index, 'monthlyRent', value)}
                        min={0}
                        size="sm"
                      >
                        <NumberInputField />
                      </NumberInput>
                    </Td>
                    <Td>
                      <input
                        type="checkbox"
                        checked={unit.occupied}
                        onChange={(e) => updateUnit(index, 'occupied', e.target.checked)}
                      />
                    </Td>
                    <Td>
                      <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => removeUnit(index)}
                        >
                          ×
                        </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </VStack>
    </Box>
  )
}