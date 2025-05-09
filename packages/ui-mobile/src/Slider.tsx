import type { SliderProps as RNSliderProps } from '@react-native-community/slider'
import type { StyleProp, ViewStyle } from 'react-native'

import RNSlider from '@react-native-community/slider'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Text } from './Text'
import { theme } from './theme'

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
    width: '100%', // Ensure container takes width for slider layout
  },
  disabledText: {
    color: theme.colors.disabled,
  },
  label: {
    color: theme.colors.textSecondary,
  },
  labelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between', // Puts label left, value right
    marginBottom: theme.spacing.s,
  },
  slider: {
    height: 40,
    width: '100%', // Default height for the touchable area
  },
  valueText: {
    color: theme.colors.text,
    fontWeight: '500',
  },
})

// Define the props, extending the base slider props implicitly via ...rest
// Omitting ref, fixing typescript error, and ref only used on web, which we arent using
export interface SliderProps extends Omit<RNSliderProps, 'ref'> {
  /** The current value of the slider. */
  value: number
  /** Callback function that is called when the slider value changes. */
  onValueChange: (value: number) => void
  /** The minimum value of the slider. @default 0 */
  minimumValue?: number
  /** The maximum value of the slider. @default 1 */
  maximumValue?: number
  /** The step value for the slider increments. @default 0 */
  step?: number
  /** Optional label displayed above the slider. */
  label?: string
  /** If true, the slider is visually inactive and cannot be modified. */
  disabled?: boolean
  /** If true, displays the current numeric value next to the label. @default false */
  showValue?: boolean
  /** Custom style for the outer container View. */
  containerStyle?: StyleProp<ViewStyle>
}

export function Slider({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 1, // Default for RNSlider if not provided
  step = 0, // Default for RNSlider if not provided
  label,
  disabled = false,
  showValue = false,
  containerStyle,
  ...rest // Pass remaining props like custom track/thumb colors to RNSlider
}: SliderProps) {
  // Determine number of decimal places based on step
  const getDecimalPlaces = (num: number): number => {
    if (Math.floor(num) === num || num === 0)
      return 0
    try {
      return num.toString().split('.')[1]?.length || 0
    }
    catch {
      return 0
    }
  }
  const decimalPlaces = getDecimalPlaces(step)
  const displayValue = value.toFixed(decimalPlaces)

  return (
    <View style={[styles.container, containerStyle]}>
      {(label || showValue) && (
        <View style={styles.labelContainer}>
          {label && (
            <Text variant="label" style={[styles.label, disabled && styles.disabledText]}>
              {label}
            </Text>
          )}
          {showValue && (
            <Text variant="caption" style={[styles.valueText, disabled && styles.disabledText]}>
              {displayValue}
            </Text>
          )}
        </View>
      )}
      <RNSlider
        style={styles.slider}
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        disabled={disabled}
        // Apply theme colors unless overridden by specific props via ...rest
        minimumTrackTintColor={disabled ? theme.colors.disabled : theme.colors.primary}
        maximumTrackTintColor={theme.colors.border} // A neutral background track color
        thumbTintColor={disabled ? theme.colors.disabled : theme.colors.primary} // Or theme.colors.surface for a white thumb
        {...rest}
      />
    </View>
  )
}
