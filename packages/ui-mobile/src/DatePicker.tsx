import type { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'

import DateTimePicker from '@react-native-community/datetimepicker'
import React, { useState } from 'react'
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'

import { Text } from './Text'
import { theme } from './theme'

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
  },
  disabledText: {
    color: theme.colors.disabled,
  },
  label: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.s,
  },
  placeholderText: {
    color: theme.colors.textSecondary,
  },
  trigger: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center', // Center text vertically
    minHeight: 48, // Match TextInput height
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s, // Match TextInput vertical padding
  },
  triggerDisabled: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.disabled,
  },
  triggerPressed: {
    borderColor: theme.colors.primary, // Indicate interaction
    // backgroundColor: theme.colors.background, // Optional subtle press feedback
  },
  triggerText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
  },
})

export interface DatePickerProps extends Omit<Parameters<typeof DateTimePicker>[0], 'value' | 'onChange' | 'mode' | 'display' | 'disabled'> {
  /** The currently selected date. */
  value: Date
  /** Callback function when the date/time is selected or the picker is dismissed. */
  onChange: (event: DateTimePickerEvent, selectedDate?: Date) => void
  /** The mode of the picker ('date', 'time', 'datetime'). @default 'date' */
  mode?: 'date' | 'time' | 'datetime'
  /** How the picker should be displayed (platform-specific interpretation). @default 'default' */
  display?: 'default' | 'spinner' | 'calendar' | 'clock'
  /** If true, the picker trigger is disabled. */
  disabled?: boolean
  /** Optional label displayed above the trigger. */
  label?: string
  /** Placeholder text when no date is selected (if value could be null/undefined). */
  placeholder?: string
  /** Custom style for the outer container View. */
  containerStyle?: StyleProp<ViewStyle>
  /** Custom style for the label AppText. */
  labelStyle?: StyleProp<TextStyle>
  /** Custom style for the Pressable trigger element. */
  triggerStyle?: StyleProp<ViewStyle>
  /** Custom style for the AppText displaying the date inside the trigger. */
  textStyle?: StyleProp<TextStyle>
}

export function DatePicker({
  value,
  onChange,
  mode = 'date',
  display = Platform.OS === 'ios' ? 'spinner' : 'default', // Sensible defaults
  disabled = false,
  label,
  placeholder = 'Select date...',
  containerStyle,
  labelStyle,
  triggerStyle,
  textStyle,
  ...rest
}: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false)

  const handlePress = () => {
    if (!disabled) {
      setShowPicker(!showPicker)
    }
  }

  const handlePickerChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    // Only call the parent onChange if a date was actually selected or if it's a dismissal event
    // (The parent might want to know about dismissals too)
    // The library behavior might vary slightly, check docs if needed.
    // Typically, you only care if `selectedDate` is defined.
    onChange(event, selectedDate)
  }

  const formatDate = (date: Date): string => {
    if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
      return placeholder
    }
    try {
      if (mode === 'time') {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // Format as HH:MM
      }
      else if (mode === 'datetime') {
        // Combine date and time formats
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      }
      // Default to 'date' mode format
      return date.toLocaleDateString() // Locale-specific date format
    }
    catch (error) {
      console.error('Error formatting date:', error)
      return placeholder
    }
  }

  const displayValue = formatDate(value)
  const isPlaceholder = displayValue === placeholder

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          variant="label"
          style={[styles.label, labelStyle, disabled && styles.disabledText]}
        >
          {label}
        </Text>
      )}
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.trigger,
          disabled && styles.triggerDisabled,
          pressed && !disabled && styles.triggerPressed,
          triggerStyle,
        ]}
        accessibilityRole="button"
        accessibilityLabel={label ? `${label}, ${displayValue}` : displayValue}
        accessibilityState={{ disabled }}
      >
        <Text style={[
          styles.triggerText,
          isPlaceholder && styles.placeholderText,
          disabled && styles.disabledText,
          textStyle,
        ]}
        >
          {displayValue}
        </Text>
      </Pressable>

      {showPicker && !disabled && (
        <DateTimePicker
          value={value instanceof Date && !Number.isNaN(value.getTime()) ? value : new Date()}
          mode={mode}
          display={display}
          onChange={handlePickerChange}
          disabled={disabled}
          {...rest}
        />
      )}
    </View>
  )
}
