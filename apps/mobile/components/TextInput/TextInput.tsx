import type { TextInputProps as RNTextInputProps, StyleProp, TextStyle, ViewStyle } from 'react-native'

import React from 'react'
import {
  TextInput as RNTextInput,
  StyleSheet,
  View,
} from 'react-native'

import { Text } from '~/components/Text/Text'
import theme from '~/styles/theme'

// Extend React Native's TextInputProps and add our custom ones
export interface TextInputProps extends RNTextInputProps {
  /** Optional label displayed above the input. */
  label?: string
  /** Optional error message displayed below the input. */
  error?: string
  /** Custom style for the outer container View. */
  containerStyle?: StyleProp<ViewStyle>
  /** Custom style for the label AppText. */
  labelStyle?: StyleProp<TextStyle>
  /** Custom style for the error AppText. */
  errorStyle?: StyleProp<TextStyle>
  /** Custom style for the TextInput itself (merged with base styles). */
  style?: StyleProp<TextStyle> // Allow direct style prop for TextInput
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m, // Spacing between input fields
  },
  label: {
    marginBottom: theme.spacing.s,
    color: theme.colors.textSecondary, // Use theme color for label
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s, // Adjust vertical padding as needed
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    minHeight: 48, // Ensure consistent height, similar to button
  },
  inputDisabled: {
    backgroundColor: theme.colors.background, // Use a subtle background for disabled
    borderColor: theme.colors.disabled,
    color: theme.colors.textSecondary, // Dim text color when disabled
  },
  inputError: {
    borderColor: theme.colors.error, // Red border for error state
  },
  error: {
    marginTop: theme.spacing.s,
    color: theme.colors.error, // Red color for error text
  },
})

export function TextInput({
  label,
  error,
  containerStyle,
  labelStyle,
  errorStyle,
  style, // This is the style for the RNTextInput itself
  editable = true, // Default editable to true
  ...rest // Spread the remaining RNTextInputProps
}: TextInputProps) {
  const isDisabled = editable === false // Use editable prop to determine disabled state
  const hasError = !!error

  // Combine styles for the TextInput element
  const inputStyle = [
    styles.input,
    isDisabled && styles.inputDisabled,
    hasError && styles.inputError,
    style, // Apply custom TextInput style last
  ]

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="label" style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      <RNTextInput
        style={inputStyle}
        placeholderTextColor={theme.colors.textSecondary} // Use theme for placeholder
        editable={!isDisabled} // Control editability based on combined state
        {...rest} // Pass all other TextInput props
      // Ensure disabled state is visually clear even if editable is managed
      // Note: RN TextInput already handles non-editability via `editable` prop
      />
      {hasError && (
        <Text variant="caption" style={[styles.error, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  )
}
