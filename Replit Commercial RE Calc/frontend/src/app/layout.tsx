
'use client'

import { ChakraProvider, extendTheme, Box } from '@chakra-ui/react'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// Modern SaaS theme configuration
const theme = extendTheme({
  fonts: {
    heading: inter.style.fontFamily,
    body: inter.style.fontFamily,
  },
  colors: {
    brand: {
      50: '#E6F3FF',
      100: '#CCE7FF',
      200: '#99CFFF',
      300: '#66B7FF',
      400: '#339FFF',
      500: '#0087FF', // Primary brand color
      600: '#006BCC',
      700: '#004F99',
      800: '#003366',
      900: '#001733',
    },
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    }
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: 'brand.700',
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s',
        },
        outline: {
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
            transform: 'translateY(-1px)',
          },
        }
      }
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'white',
          borderRadius: 'xl',
          boxShadow: 'sm',
          border: '1px solid',
          borderColor: 'gray.200',
          _hover: {
            boxShadow: 'md',
          },
          transition: 'all 0.2s',
        }
      }
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'brand.500',
      },
      variants: {
        outline: {
          field: {
            borderColor: 'gray.300',
            _hover: {
              borderColor: 'gray.400',
            },
            _focus: {
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
            }
          }
        }
      }
    },
    FormLabel: {
      baseStyle: {
        fontWeight: 'semibold',
        color: 'gray.700',
        fontSize: 'sm',
      }
    }
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
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
          <Box minH="100vh" bg="gray.50">
            {children}
          </Box>
        </ChakraProvider>
      </body>
    </html>
  )
}
