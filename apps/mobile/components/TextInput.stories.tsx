import type { Meta, StoryObj } from '@storybook/react'

import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import type { TextInputProps } from '@victorli/7guis-ui-mobile/TextInput'

import { TextInput } from '@victorli/7guis-ui-mobile/TextInput'
import { theme } from '@victorli/7guis-ui-mobile/theme'

const styles = StyleSheet.create({
  decoratorView: {
    padding: theme.spacing.m,
    width: '100%', // Ensure input takes reasonable width
    maxWidth: 400, // Limit max width for better readability
  },
})

// Helper component to manage state for controlled input stories
function TextInputStateWrapper(props: TextInputProps) {
  const [value, setValue] = useState(props.value || '')
  return <TextInput {...props} value={value} onChangeText={setValue} />
}

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  args: {
    // Default args for controls table
    label: '',
    error: '',
    placeholder: 'Enter text...',
    editable: true,
    keyboardType: 'default',
    secureTextEntry: false,
  },
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text' }, // Allow setting initial value via controls
    editable: { control: 'boolean' },
    secureTextEntry: { control: 'boolean' },
    keyboardType: {
      control: 'select',
      options: [
        'default',
        'numeric',
        'email-address',
        'phone-pad',
        'number-pad',
        'decimal-pad',
        'visible-password',
        'ascii-capable',
        'numbers-and-punctuation',
        'url',
        'name-phone-pad',
        'twitter',
        'web-search',
      ],
    },
    onChangeText: { action: 'changed' }, // Log text changes
    // Hide internal styles from controls table if desired
    // containerStyle: { table: { disable: true } },
    // labelStyle: { table: { disable: true } },
    // errorStyle: { table: { disable: true } },
    // style: { table: { disable: true } },
  },
  decorators: [
    Story => (
      <View style={styles.decoratorView}>
        <Story />
      </View>
    ),
  ],
  // Use the wrapper for most stories to handle state
  render: args => <TextInputStateWrapper {...args} />,
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter text here...',
    // No label, no error, controlled by wrapper
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
  },
}

export const WithValue: Story = {
  args: {
    label: 'Email Address',
    value: 'prefilled.email@example.com', // Initial value
    placeholder: 'Enter your email',
    keyboardType: 'email-address',
  },
}

export const WithError: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    error: 'Password must be at least 8 characters long.',
    value: 'short', // Provide a value to trigger the conceptual error
    secureTextEntry: true,
  },
}

export const NonEditable: Story = {
  args: {
    label: 'Non-Editable Field',
    value: 'This value is read-only',
    editable: false, // Use the editable prop
  },
}

export const NumericKeyboard: Story = {
  args: {
    label: 'Age',
    placeholder: 'Enter your age',
    keyboardType: 'numeric',
  },
}

export const SecureEntry: Story = {
  args: {
    label: 'Confirm Password',
    placeholder: 'Re-enter your password',
    secureTextEntry: true,
  },
}

export const CustomStyles: Story = {
  args: {
    label: 'Styled Input',
    placeholder: 'Enter something stylish',
    containerStyle: {
      backgroundColor: '#E0F2FE', // Light blue background for container
      padding: theme.spacing.m,
      borderRadius: theme.spacing.s,
    },
    labelStyle: {
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    style: { // Style for the TextInput itself
      backgroundColor: 'white',
      borderColor: theme.colors.secondary,
      borderWidth: 2,
      fontSize: 18,
    },
    error: 'This is a styled error',
    errorStyle: {
      fontStyle: 'italic',
      fontWeight: 'bold',
    },
  },
}
