import type { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import type { Meta, StoryObj } from '@storybook/react'

import React, { useState } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import theme from '~/styles/theme'

import type { DatePickerProps } from './DatePicker'

import { DatePicker } from './DatePicker'

const styles = StyleSheet.create({
  decoratorView: {
    padding: theme.spacing.m,
    width: '100%', // Ensure takes reasonable width
    maxWidth: 400, // Limit max width
  },
})

// Helper component to manage state for controlled date picker stories
function DatePickerStateWrapper(props: DatePickerProps) {
  // Ensure initial value is a valid date or default to now
  const initialDate = (props.value instanceof Date && !Number.isNaN(props.value.getTime()))
    ? props.value
    : new Date()
  const [date, setDate] = useState(initialDate)

  const handleChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    // Log the event type for debugging (e.g., 'set', 'dismissed')
    // eslint-disable-next-line no-console
    console.log('Picker Event:', event.type)

    // Only update the state if a date was selected (type 'set')
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate)
    }
    else {
      // Handle dismissal if needed, e.g., show an alert
      // Alert.alert("Picker Dismissed");
    }
    // Call the original onChange passed from story args (for action logging)
    props.onChange?.(event, selectedDate)
  }

  return <DatePicker {...props} value={date} onChange={handleChange} />
}

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  args: {
    // Default args for controls table
    label: 'Select Date/Time',
    value: new Date(), // Use a valid Date object
    mode: 'date',
    display: Platform.OS === 'ios' ? 'spinner' : 'default',
    disabled: false,
    placeholder: 'No date selected',
  },
  argTypes: {
    value: { control: 'date' }, // Storybook date control
    mode: {
      control: 'select',
      options: ['date', 'time', 'datetime'],
    },
    display: {
      control: 'select',
      options: ['default', 'spinner', 'calendar', 'clock'],
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    onChange: { action: 'changed' },
    // Hide styles from controls table if desired
    // containerStyle: { table: { disable: true } },
    // labelStyle: { table: { disable: true } },
    // triggerStyle: { table: { disable: true } },
    // textStyle: { table: { disable: true } },
  },
  decorators: [
    Story => (
      <View style={styles.decoratorView}>
        <Story />
      </View>
    ),
  ],
  // Use the wrapper for stories to handle state
  render: args => <DatePickerStateWrapper {...args} />,
}

export default meta

type Story = StoryObj<typeof meta>

export const DateMode: Story = {
  args: {
    label: 'Start Date',
    mode: 'date',
    value: new Date(2024, 5, 15), // Example: June 15, 2024 (month is 0-indexed)
  },
}

export const TimeMode: Story = {
  args: {
    label: 'Meeting Time',
    mode: 'time',
    value: new Date(2024, 0, 1, 14, 30), // Example: 2:30 PM
    display: Platform.OS === 'ios' ? 'spinner' : 'clock', // More specific default for time
  },
}

export const DateTimeMode: Story = {
  args: {
    label: 'Appointment',
    mode: 'datetime',
    value: new Date(2024, 7, 20, 10, 0), // Example: Aug 20, 2024, 10:00 AM
  },
}

export const Disabled: Story = {
  args: {
    label: 'Locked Date',
    value: new Date(),
    disabled: true,
  },
}
