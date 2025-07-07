'use client'

import { Inter } from 'next/font/google'
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#e6f3ff' },
          100: { value: '#b3d9ff' },
          200: { value: '#80bfff' },
          300: { value: '#4da6ff' },
          400: { value: '#1a8cff' },
          500: { value: '#0073e6' },
          600: { value: '#005bb3' },
          700: { value: '#004280' },
          800: { value: '#002a4d' },
          900: { value: '#00111a' },
        },
      },
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
      <body className={inter.className}>
        <ChakraProvider value={system}>
          {children}
        </ChakraProvider>
      </body>
    </html>
  )
}