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
  IconButton,
  useToast
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
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
            value={vacancyRate}
            onChange={(_, value) => handleVacancyRateChange(value)}
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
            <Button leftIcon={<AddIcon />} onClick={addUnit} size="sm">
              Add Unit
            </Button>
          </HStack>

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
                        style={{ width: '80px' }}
                      />
                    </Td>
                    <Td>
                      <input
                        value={unit.unitType}
                        onChange={(e) => updateUnit(index, 'unitType', e.target.value)}
                        style={{ width: '100px' }}
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
                      <IconButton
                        aria-label="Delete unit"
                        icon={<DeleteIcon />}
                        size="sm"
                        onClick={() => removeUnit(index)}
                        colorScheme="red"
                        variant="ghost"
                      />
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