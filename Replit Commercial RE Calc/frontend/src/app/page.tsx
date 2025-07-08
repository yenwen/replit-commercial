'use client'

import { Box, Container, Heading, Text, VStack, HStack, Badge, Flex, Icon, Button, useColorModeValue } from '@chakra-ui/react'
import { FiTrendingUp, FiTarget } from 'react-icons/fi'
import DealAnalyzer from '@/components/DealAnalyzer'

export default function Home() {
  const bgGradient = useColorModeValue(
    'linear(to-br, brand.500, brand.600)',
    'linear(to-br, brand.600, brand.700)'
  )

  return (
    <Box>
      {/* Modern Header */}
      <Box bg={bgGradient} color="white" py={{ base: 12, md: 16 }}>
        <Container maxW="7xl">
          <VStack spacing={6} textAlign="center">
            <Badge 
              colorScheme="whiteAlpha" 
              variant="solid" 
              px={4} 
              py={2} 
              borderRadius="full"
              fontSize="sm"
              fontWeight="semibold"
            >
              Professional Real Estate Analysis
            </Badge>

            <Heading 
              size={{ base: 'xl', md: '2xl' }} 
              fontWeight="bold"
              lineHeight="shorter"
              maxW="4xl"
            >
              Commercial Real Estate Investment Calculator
            </Heading>

            <Text 
              fontSize={{ base: 'lg', md: 'xl' }} 
              color="whiteAlpha.900"
              maxW="2xl"
              lineHeight="tall"
            >
              Analyze multifamily and commercial properties with institutional-grade metrics. 
              Get IRR, cash-on-cash returns, and AI-powered investment insights.
            </Text>

            {/* Feature highlights */}
            <HStack 
              spacing={8} 
              flexWrap="wrap" 
              justify="center"
              pt={4}
            >
              <HStack spacing={2}>
                <Icon as={FiTrendingUp} boxSize={5} />
                <Text fontSize="sm" fontWeight="medium">Comprehensive Analysis</Text>
              </HStack>
              <HStack spacing={2}>
                <Icon as={FiTrendingUp} boxSize={5} />
                <Text fontSize="sm" fontWeight="medium">IRR & Cash Flow</Text>
              </HStack>
              <HStack spacing={2}>
                <Icon as={FiTarget} boxSize={5} />
                <Text fontSize="sm" fontWeight="medium">AI Insights</Text>
              </HStack>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="7xl" py={{ base: 8, md: 12 }}>
        <DealAnalyzer />
      </Container>

      {/* Footer */}
      <Box bg="gray.800" color="white" py={8} mt={16}>
        <Container maxW="7xl">
          <Flex 
            direction={{ base: 'column', md: 'row' }} 
            justify="space-between" 
            align="center"
            gap={4}
          >
            <Text fontSize="sm">
              © 2024 Commercial RE Calculator. Built for real estate professionals.
            </Text>
            <HStack spacing={6}>
              <Text fontSize="sm" color="gray.400">
                Powered by AI
              </Text>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}