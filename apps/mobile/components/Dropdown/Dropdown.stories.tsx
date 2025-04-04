import type { Meta, StoryObj } from '@storybook/react'

import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { Text } from '~/components/Text/Text'
import theme from '~/styles/theme'

import type { DropdownProps } from './Dropdown'

import { Dropdown } from './Dropdown'

const styles = StyleSheet.create({
  decoratorView: {
    padding: theme.spacing.m,
    width: '100%', // Ensure takes reasonable width
    maxWidth: 400, // Limit max width
  },
})

// Sample data for stories
const sampleItems = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte', color: theme.colors.secondary }, // Example with color
  { label: 'Solid', value: 'solid' },
]

const placeholderItem = { label: 'Select framework...', value: null }

// Helper component to manage state for controlled dropdown stories
function DropdownStateWrapper(props: DropdownProps) {
  // Initialize state with the value from args, or placeholder value if applicable
  const initialValue = props.value ?? (props.placeholder && 'value' in props.placeholder ? props.placeholder.value : null)
  const [selectedValue, setSelectedValue] = useState(initialValue)

  // Update state if story controls change the value prop
  React.useEffect(() => {
    setSelectedValue(props.value)
  }, [props.value])

  const handleValueChange = (value: any, index: number) => {
    setSelectedValue(value)
    // eslint-disable-next-line no-console
    console.log(`Selected: ${value} at index ${index}`)
    props.onValueChange?.(value, index) // Call original callback if provided
  }

  return (
    <View>
      <Dropdown
        {...props}
        value={selectedValue}
        onValueChange={handleValueChange}
      />
      {/* Optional: Display current value below for debugging */}
      <Text>
        Current Value:
        {' '}
        {JSON.stringify(selectedValue)}
      </Text>
    </View>
  )
}

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  args: {
    // Default args for controls table
    label: 'Framework Choice',
    items: sampleItems,
    placeholder: placeholderItem,
    value: placeholderItem.value, // Start with placeholder selected
    disabled: false,
    onValueChange: () => { }, // Dummy function for default args
  },
  argTypes: {
    value: {
      control: 'select', // Use select based on items + placeholder
      options: [
        ...(placeholderItem.value !== undefined ? [placeholderItem.value] : []),
        ...sampleItems.map(item => item.value),
      ],
      mapping: Object.fromEntries([ // Map values to labels for better control display
        ...(placeholderItem.value !== undefined ? [[placeholderItem.value, placeholderItem.label]] : []),
        ...sampleItems.map(item => [item.value, item.label]),
      ]),
    },
    items: { control: 'object' }, // Allow editing items as JSON object
    placeholder: { control: 'object' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    onValueChange: { action: 'changed' },
    // Hide styles from controls table if desired
    // containerStyle: { table: { disable: true } },
    // labelStyle: { table: { disable: true } },
    // style: { table: { disable: true } },
    // pickerContainerStyle: { table: { disable: true } },
  },
  decorators: [
    Story => (
      <View style={styles.decoratorView}>
        <Story />
      </View>
    ),
  ],
  // Use the wrapper for stories to handle state
  render: args => <DropdownStateWrapper {...args} />,
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // Uses default args with placeholder
  },
}

export const WithValueSelected: Story = {
  args: {
    label: 'Selected Framework',
    value: 'vue', // Pre-select Vue
    placeholder: placeholderItem, // Still include placeholder in list
  },
}

export const Disabled: Story = {
  args: {
    label: 'Cannot Change Framework',
    value: 'react',
    disabled: true,
  },
}

export const NoPlaceholder: Story = {
  args: {
    label: 'Required Framework',
    placeholder: {}, // Explicitly no placeholder
    // If no placeholder, the first item might be selected by default, or value might be required
    value: sampleItems[0]?.value, // Set initial value to the first actual item
  },
  argTypes: { // Override value control for this story if placeholder isn't an option
    value: {
      control: 'select',
      options: sampleItems.map(item => item.value),
      mapping: Object.fromEntries(sampleItems.map(item => [item.value, item.label])),
    },
  },
}

export const DifferentDataTypes: Story = {
  args: {
    label: 'Select Number',
    items: [
      { label: 'One', value: 1 },
      { label: 'Two', value: 2 },
      { label: 'Three', value: 3 },
    ],
    placeholder: { label: 'Select a number...', value: 0 }, // Use 0 as placeholder value
    value: 0,
  },
  argTypes: {
    value: {
      control: 'select',
      options: [0, 1, 2, 3],
      mapping: { 0: 'Select a number...', 1: 'One', 2: 'Two', 3: 'Three' },
    },
  },
}
