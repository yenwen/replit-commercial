'use client'

import { Box, Container, Heading, Text, VStack, HStack, Badge, Icon } from '@chakra-ui/react'
import { FiTrendingUp, FiDollarSign, FiPieChart } from 'react-icons/fi'
import DealAnalyzer from '@/components/DealAnalyzer'

export default function Home() {
  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header Section */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
        <Container maxW="container.xl">
          <VStack spacing={4} textAlign="center">
            <Badge colorScheme="brand" px={3} py={1} borderRadius="full" fontSize="sm">
              AI-Powered Analysis
            </Badge>
            <Heading as="h1" size="2xl" color="gray.800" fontWeight="700">
              Commercial Real Estate Calculator
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="2xl">
              Professional-grade investment analysis for multifamily and commercial properties. 
              Get instant grades, recommendations, and detailed financial projections.
            </Text>

            {/* Feature highlights */}
            <HStack spacing={8} mt={6} flexWrap="wrap" justify="center">
              <HStack spacing={2} color="gray.600">
                <Icon as={FiTrendingUp} color="brand.500" />
                <Text fontSize="sm" fontWeight="600">IRR & Cash Flow Analysis</Text>
              </HStack>
              <HStack spacing={2} color="gray.600">
                <Icon as={FiDollarSign} color="brand.500" />
                <Text fontSize="sm" fontWeight="600">Investment Grading</Text>
              </HStack>
              <HStack spacing={2} color="gray.600">
                <Icon as={FiPieChart} color="brand.500" />
                <Text fontSize="sm" fontWeight="600">Sensitivity Analysis</Text>
              </HStack>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={8}>
        <DealAnalyzer />
      </Container>
    </Box>
  )
}