import type { TextStyle } from 'react-native'

export const colors = {
  primary: '#4F46E5', // Indigo 600
  secondary: '#10B981', // Emerald 500
  background: '#F9FAFB', // Gray 50
  surface: '#FFFFFF', // White
  text: '#1F2937', // Gray 800
  textSecondary: '#6B7280', // Gray 500
  disabled: '#D1D5DB', // Gray 300
  error: '#EF4444', // Red 500
  border: '#E5E7EB', // Gray 200
}

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
}

// Define a type for the typography variants
interface TypographyVariants {
  h1: TextStyle
  h2: TextStyle
  body: TextStyle
  label: TextStyle
  caption: TextStyle
  button: TextStyle
}

export const typography: TypographyVariants = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
    color: colors.text,
  },
  label: {
    fontSize: 14,
    fontWeight: '500', // Medium weight
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
    color: colors.textSecondary,
  },
  button: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.surface, // Assuming button text is often on primary/colored background
  },
}

export const theme = {
  colors,
  spacing,
  typography,
}
