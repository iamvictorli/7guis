import type { StyleProp, ViewStyle } from 'react-native'

import React from 'react'
import {
  Platform,

  StyleSheet,
  View,

} from 'react-native'

import theme from '~/styles/theme'

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8, // Moderate border radius
    padding: theme.spacing.m, // Standard padding
    marginVertical: theme.spacing.s, // Vertical margin for spacing in lists etc.
    marginHorizontal: theme.spacing.xs, // Slight horizontal margin
    // Platform-specific shadow/elevation for depth
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.20, // Subtle shadow
        shadowRadius: 1.41, // Soft shadow edge
      },
      android: {
        elevation: 2, // Moderate elevation for Android
        // Note: Android elevation can sometimes clip shadows if overflow is hidden on parent
      },
    }),
  },
})

export interface CardProps {
  /** The content to be displayed inside the card. */
  children: React.ReactNode
  /** Optional custom styles to be applied to the card's View container. */
  style?: StyleProp<ViewStyle>
}

export function Card({ children, style }: CardProps) {
  // Combine base card styles with any custom styles passed in
  const combinedStyle = [styles.card, style]

  return <View style={combinedStyle}>{children}</View>
}
