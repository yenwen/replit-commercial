'use client'

import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'
import DealAnalyzer from '@/components/DealAnalyzer'

export default function Home() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center" py={8}>
          <Heading as="h1" size="2xl" color="brand.600" mb={4}>
            Commercial RE Calculator
          </Heading>
          <Text fontSize="lg" color="gray.600">
            AI-Enhanced Deal Analyzer for Multifamily & Commercial Real Estate
          </Text>
        </Box>
        
        <DealAnalyzer />
      </VStack>
    </Container>
  )
} 