'use client'

import { Inter } from 'next/font/google'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f3ff',
      100: '#b3d9ff',
      200: '#80bfff',
      300: '#4da6ff',
      400: '#1a8cff',
      500: '#0073e6',
      600: '#005bb3',
      700: '#004280',
      800: '#002a4d',
      900: '#00111a',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand'
      }
    }
  }
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChakraProvider theme={theme}>
          {children}
        </ChakraProvider>
      </body>
    </html>
  )
}