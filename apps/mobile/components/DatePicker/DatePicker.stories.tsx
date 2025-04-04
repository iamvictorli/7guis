import type { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import type { Meta, StoryObj } from '@storybook/react'

import React, { useState } from 'react'
import { Alert, Platform, StyleSheet, View } from 'react-native'

import type { DatePickerProps } from './DatePicker'

import theme from '../../styles/theme'
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

  // Update state if story controls change the value prop
  React.useEffect(() => {
    if (props.value instanceof Date && !Number.isNaN(props.value.getTime())) {
      setDate(props.value)
    }
  }, [props.value])

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
      // Optionally show an alert for confirmation in the story
      Alert.alert('Date Selected', selectedDate.toLocaleDateString())
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

export const WithPlaceholder: Story = {
  args: {
    label: 'Optional Date',
    placeholder: 'Tap to select an optional date',
    // To demonstrate placeholder, we need to manage null/undefined state,
    // which requires modifying the wrapper or using a different render function.
    // For simplicity, we'll just set the placeholder text here.
    // If the component allowed `value: Date | null`, the wrapper could handle it.
    value: new Date('invalid date'), // Pass an invalid date to trigger placeholder formatting
  },
  // If strict Date prop is needed, you might need a story-specific render:
  // render: (args) => {
  //     const [date, setDate] = useState<Date | null>(null);
  //     const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
  //         if (event.type === 'set' && selectedDate) { setDate(selectedDate); }
  //         args.onChange?.(event, selectedDate);
  //     };
  //     // Need to pass a valid Date to DateTimePicker even if displaying null initially
  //     const pickerValue = date || new Date();
  //     // Display logic needs adjustment in component or wrapper to show placeholder for null
  //     return <AppDatePicker {...args} value={pickerValue} onChange={handleChange} />;
  // }
}
