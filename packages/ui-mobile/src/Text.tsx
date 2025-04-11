import type { TextProps as RNTextProps, StyleProp, TextStyle } from 'react-native'

import React from 'react'
import { Text as RNText } from 'react-native'

import type { colors, typography } from './theme'

import theme from './theme'

// Define the props interface
interface TextProps extends RNTextProps {
  /**
   * The content to display inside the text component.
   */
  children: React.ReactNode
  /**
   * Optional custom styles to be applied to the text component.
   * These will override the variant and color styles.
   */
  style?: StyleProp<TextStyle>
  /**
   * The typographic variant to use from the theme.
   * @default 'body'
   */
  variant?: keyof typeof typography
  /**
   * The color key from the theme's color palette or a custom color string.
   * Overrides the default color specified in the typography variant.
   */
  color?: keyof typeof colors | string
}

export function Text({
  children,
  style,
  variant = 'body', // Default variant is 'body'
  color,
  ...rest
}: TextProps) {
  // Get the base style from the theme based on the variant
  const baseStyle = theme.typography[variant]

  // Determine the color style
  const colorStyle: TextStyle = {}
  if (color) {
    if (color in theme.colors) {
      // Use color from theme if the key exists
      colorStyle.color = theme.colors[color as keyof typeof colors]
    }
    else {
      // Otherwise, use the provided string as a custom color
      colorStyle.color = color
    }
  }
  // If no color prop is provided, the color defined in the baseStyle (from theme.typography) will be used.

  // Combine the base style, the calculated color style, and any custom styles passed via the `style` prop.
  // Styles later in the array override earlier ones.
  const combinedStyle = [baseStyle, colorStyle, style]

  return (
    <RNText style={combinedStyle} {...rest}>
      {children}
    </RNText>
  )
}
