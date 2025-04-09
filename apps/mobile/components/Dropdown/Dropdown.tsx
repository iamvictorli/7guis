import type { StyleProp, TextStyle, ViewStyle } from 'react-native'

import { Picker } from '@react-native-picker/picker'
import React from 'react'
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native'

import { Text } from '~/components/Text/Text'
import theme from '~/styles/theme'

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
  },
  label: {
    marginBottom: theme.spacing.s,
    color: theme.colors.textSecondary,
  },
  // Wrapper needed for Android background/border styling
  androidPickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center', // Helps center text vertically somewhat
    minHeight: 48, // Match TextInput height
  },
  picker: {
    width: '100%',
    color: theme.colors.text,
    // On iOS, style here affects the trigger text, height might be needed
    // On Android, styling here is limited, use the container ^
    ...(Platform.OS === 'ios' && {
      minHeight: 48, // Ensure touchable area
      paddingLeft: theme.spacing.m, // Indent text like TextInput
      paddingRight: theme.spacing.l, // Space for arrow
      borderWidth: 1, // Add border for consistency on iOS
      borderColor: theme.colors.border,
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
    }),
    ...(Platform.OS !== 'android' && Platform.OS !== 'ios' && { // Basic web styles
      minHeight: 48,
      paddingHorizontal: theme.spacing.m,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
      appearance: 'none', // Remove default browser styling
    }),
  },
  iosItemStyle: {
    // Add specific iOS item styles here if needed (e.g., fontSize)
    // fontSize: theme.typography.body.fontSize,
  },
  disabledBackground: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.disabled, // Match disabled input border
  },
  disabledText: {
    color: theme.colors.disabled,
  },
  // Simple visual arrow for iOS (optional)
  iosArrow: {
    position: 'absolute',
    right: theme.spacing.m,
    bottom: 18, // Adjust vertical position as needed
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: theme.colors.textSecondary, // Arrow color
  },
})

// Define the structure for dropdown items
interface DropdownItem {
  label: string
  value: any
  color?: string // Optional: Pass color to Picker.Item
}

// Define the structure for the placeholder item
interface PlaceholderItem {
  label: string
  value: any // Typically null, undefined, or a specific sentinel value
  color?: string
}

export interface DropdownProps {
  /** Array of items to display in the dropdown. */
  items: DropdownItem[]
  /** The currently selected value. */
  value: any
  /** Callback function when an item is selected. */
  onValueChange: (value: any, index: number) => void
  /** Optional placeholder item configuration. If label/value provided, prepended to items. */
  placeholder?: PlaceholderItem | Record<never, never> // Accept empty object to signify no placeholder
  /** Optional label displayed above the dropdown. */
  label?: string
  /** If true, the dropdown is disabled. */
  disabled?: boolean
  /** Custom style for the outer container View. */
  containerStyle?: StyleProp<ViewStyle>
  /** Custom style for the label AppText. */
  labelStyle?: StyleProp<TextStyle>
  /** Custom style applied directly to the Picker component. */
  style?: StyleProp<TextStyle> // Picker only accepts TextStyle properties
  /** Style for the container View wrapping the Picker (useful for Android background/border). */
  pickerContainerStyle?: StyleProp<ViewStyle>
}

const emptyPlaceholder = {}

export function Dropdown({
  items,
  value,
  onValueChange,
  placeholder = emptyPlaceholder, // Default to no placeholder
  label,
  disabled = false,
  containerStyle,
  labelStyle,
  style, // Style for the Picker itself
  pickerContainerStyle, // Style for the wrapper View
  ...rest // Pass other Picker props if needed
}: DropdownProps) {
  const hasPlaceholder = 'label' in placeholder && 'value' in placeholder

  // Determine the combined list of items including the placeholder if provided
  const pickerItems = [
    ...(hasPlaceholder ? [placeholder as PlaceholderItem] : []),
    ...items,
  ]

  // On Android, wrap Picker in a View to apply background/border styles reliably
  const PickerWrapper = Platform.OS === 'android' ? View : React.Fragment
  const pickerWrapperProps = Platform.OS === 'android'
    ? { style: [styles.androidPickerContainer, pickerContainerStyle, disabled && styles.disabledBackground] }
    : {}

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
      <PickerWrapper {...pickerWrapperProps}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          enabled={!disabled}
          style={[
            styles.picker,
            disabled && styles.disabledText, // Dim text color on iOS/Web
            style, // Apply custom style prop
          ]}
          mode="dropdown" // Default mode, mainly affects Android
          dropdownIconColor={disabled ? theme.colors.disabled : theme.colors.textSecondary} // Android arrow color
          {...rest} // Pass other props
        >
          {pickerItems.map((item, index) => (
            <Picker.Item
              label={item.label}
              value={item.value}
              key={item.value !== undefined && item.value !== null ? `${item.label}-${item.value}` : `${item.label}-${index}`} // Ensure unique key
              color={item.color} // Allow individual item color styling
              style={Platform.OS === 'ios' ? styles.iosItemStyle : undefined} // Basic iOS item styling if needed
            />
          ))}
        </Picker>
      </PickerWrapper>
      {/* Optional: Add a visual dropdown arrow for iOS if desired, since Picker hides it */}
      {Platform.OS === 'ios' && !disabled && <View style={styles.iosArrow} />}
    </View>
  )
}
