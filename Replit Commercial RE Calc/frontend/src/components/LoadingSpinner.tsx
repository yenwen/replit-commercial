
'use client'

import { Box, Spinner, Text, VStack } from '@chakra-ui/react'

interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
  return (
    <Box 
      position="fixed" 
      top="0" 
      left="0" 
      right="0" 
      bottom="0" 
      bg="rgba(255, 255, 255, 0.8)" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      zIndex="9999"
    >
      <VStack spacing={4}>
        <Spinner size="xl" color="brand.500" thickness="4px" />
        <Text fontSize="lg" fontWeight="medium">{message}</Text>
      </VStack>
    </Box>
  )
}
