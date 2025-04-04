import type { Meta, StoryObj } from '@storybook/react'

import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import theme from '~/styles/theme'

import type { SliderProps } from './Slider'

import { Slider } from './Slider'

const styles = StyleSheet.create({
  decoratorView: {
    padding: theme.spacing.m,
    width: '100%', // Ensure slider takes reasonable width
    maxWidth: 400, // Limit max width
  },
})

// Helper component to manage state for controlled slider stories
function SliderStateWrapper(props: SliderProps) {
  const [value, setValue] = useState(props.value) // Initialize with story arg

  // Update state when story controls change the value prop
  React.useEffect(() => {
    setValue(props.value)
  }, [props.value])

  const handleValueChange = (newValue: number) => {
    setValue(newValue)
    props.onValueChange?.(newValue) // Call original callback if provided
  }

  return <Slider {...props} value={value} onValueChange={handleValueChange} />
}

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  args: {
    // Default args for controls table
    minimumValue: 0,
    maximumValue: 100,
    value: 50,
    step: 1,
    disabled: false,
    showValue: true, // Show value by default in stories
    label: 'Slider Label',
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } }, // Use range control linked to min/max/step
    minimumValue: { control: 'number' },
    maximumValue: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
    showValue: { control: 'boolean' },
    label: { control: 'text' },
    onValueChange: { action: 'changed' },
    // containerStyle: { table: { disable: true } },
  },
  decorators: [
    Story => (
      <View style={styles.decoratorView}>
        <Story />
      </View>
    ),
  ],
  // Use the wrapper for stories to handle state
  render: args => <SliderStateWrapper {...args} />,
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Opacity',
    value: 75,
    minimumValue: 0,
    maximumValue: 100,
    step: 1,
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Volume',
    value: 70,
    maximumValue: 100,
    step: 5,
  },
}

export const WithoutValueDisplay: Story = {
  args: {
    label: 'Brightness (No Value)',
    value: 80,
    showValue: false, // Explicitly hide value
  },
}

export const WithStep: Story = {
  args: {
    label: 'Rating (1-5)',
    value: 3,
    minimumValue: 1,
    maximumValue: 5,
    step: 1,
  },
}

export const FractionalStep: Story = {
  args: {
    label: 'Precision (0.0 - 1.0)',
    value: 0.65,
    minimumValue: 0,
    maximumValue: 1,
    step: 0.01,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Slider',
    value: 25,
    disabled: true,
  },
}

export const CustomRange: Story = {
  args: {
    label: 'Temperature (°C)',
    value: 20,
    minimumValue: -10,
    maximumValue: 40,
    step: 0.5,
  },
}

export const CustomColors: Story = {
  args: {
    label: 'Custom Colors',
    value: 60,
    minimumTrackTintColor: theme.colors.secondary, // Emerald
    maximumTrackTintColor: '#FECACA', // Red-100
    thumbTintColor: theme.colors.error, // Red-500
  },
  // Override render to pass props directly if wrapper interferes,
  // or ensure wrapper passes ...rest correctly (it does now)
}
