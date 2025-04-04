import type { StyleProp, TextStyle, ViewStyle } from 'react-native'

import React from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from 'react-native'

import { Text } from '~/components/Text/Text'
import theme from '~/styles/theme'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text'

interface ButtonProps {
  /** The text displayed on the button. */
  title: string
  /** Function called when the button is pressed. */
  onPress: () => void
  /** If true, the button is visually inactive and onPress is disabled. */
  disabled?: boolean
  /** If true, shows a loading indicator instead of the title. */
  isLoading?: boolean
  /** The visual style variant of the button. @default 'primary' */
  variant?: ButtonVariant
  /** Custom style for the Pressable container. */
  style?: StyleProp<ViewStyle>
  /** Custom style for the Text component. */
  textStyle?: StyleProp<TextStyle>
}

const styles = StyleSheet.create({
  baseContainer: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', // Align loader and text horizontally if ever needed together
    minHeight: 48, // Ensure consistent height
  },
  baseText: {
    // Use Text's default 'button' variant styles
    textAlign: 'center',
  },
  disabledContainer: {
    // opacity: 0.6, // You can use opacity OR specific disabled colors like implemented above
  },
})

export function Button({
  title,
  onPress,
  disabled = false,
  isLoading = false,
  variant = 'primary',
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || isLoading // Button is disabled if explicitly disabled or loading

  const getVariantStyles = (): { container: ViewStyle, text: TextStyle, loaderColor: string } => {
    switch (variant) {
      case 'secondary':
        return {
          container: {
            backgroundColor: isDisabled ? theme.colors.disabled : theme.colors.secondary,
            borderColor: 'transparent',
            borderWidth: 1,
          },
          text: {
            color: isDisabled ? theme.colors.textSecondary : theme.colors.surface,
          },
          loaderColor: theme.colors.surface,
        }
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: isDisabled ? theme.colors.disabled : theme.colors.primary,
            borderWidth: 1,
          },
          text: {
            color: isDisabled ? theme.colors.disabled : theme.colors.primary,
          },
          loaderColor: theme.colors.primary,
        }
      case 'text':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderWidth: 1, // Keep consistent height using border
            paddingHorizontal: theme.spacing.s, // Less padding for text buttons
            paddingVertical: theme.spacing.s,
          },
          text: {
            color: isDisabled ? theme.colors.disabled : theme.colors.primary,
            fontWeight: '500', // Slightly less bold than default button
          },
          loaderColor: theme.colors.primary,
        }
      case 'primary':
      default:
        return {
          container: {
            backgroundColor: isDisabled ? theme.colors.disabled : theme.colors.primary,
            borderColor: 'transparent',
            borderWidth: 1,
          },
          text: {
            color: isDisabled ? theme.colors.textSecondary : theme.colors.surface,
          },
          loaderColor: theme.colors.surface,
        }
    }
  }

  const variantStyles = getVariantStyles()

  const containerStyle = [
    styles.baseContainer,
    variantStyles.container,
    isDisabled && styles.disabledContainer, // General disabled opacity (optional)
    style, // Apply custom container style last
  ]

  const titleStyle = [
    styles.baseText, // Base text includes default button typography
    variantStyles.text,
    textStyle, // Apply custom text style last
  ]

  return (
    <Pressable
      style={containerStyle}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      {isLoading
        ? (
            <ActivityIndicator size="small" color={variantStyles.loaderColor} />
          )
        : (
            <Text style={titleStyle} variant="button">
              {title}
            </Text>
          )}
    </Pressable>
  )
}
