
'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'

// Create a custom theme with brand colors
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3',
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
        overflowY: 'auto', // Enable vertical scrolling
        height: '100vh',
      },
      html: {
        height: '100%',
        overflowY: 'auto', // Enable vertical scrolling
      },
      '#__next': {
        height: '100%',
        minHeight: '100vh',
      }
    },
  },
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={theme}>
          {children}
        </ChakraProvider>
      </body>
    </html>
  )
}
