import type { DateTimePickerEvent } from '@react-native-community/datetimepicker'

import React from 'react'
import { Alert, StyleSheet, View } from 'react-native'

import { dateChanged, FlightTrip, flightTypeChanged, selectFlightBookerState, selectIsBookableFlight } from '@7guis/state/flightBookerSlice'
import { useAppDispatch, useAppSelector } from '@7guis/state/hooks'
import { Button } from '~/components/Button/Button'
import { DatePicker } from '~/components/DatePicker/DatePicker'
import { Dropdown } from '~/components/Dropdown/Dropdown'
import { commonStyles } from '~/styles/commonStyles'
import theme from '~/styles/theme'

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.l,
    // justifyContent: 'center', // Let content flow from top
  },
  inputSpacing: {
    marginBottom: theme.spacing.l, // Space between inputs
  },
  bookButton: {
    marginTop: theme.spacing.l, // Space above the button
    alignSelf: 'center', // Center the button
    minWidth: 180,
  },
})

export function FlightBooker() {
  const dispatch = useAppDispatch()
  const { departureDate, returnDate, trip } = useAppSelector(selectFlightBookerState)
  const isBookableFlight = useAppSelector(selectIsBookableFlight)

  const flightOptions = [
    { label: 'One-way flight', value: FlightTrip.OneWay },
    { label: 'Return flight', value: FlightTrip.RoundTrip },
  ]

  const handleFlightTypeChange = (value: FlightTrip) => {
    dispatch(flightTypeChanged(value))
  }

  const handleStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      dispatch(dateChanged({ departureDate: selectedDate.toString() }))
    }
  }

  const handleReturnDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (trip === FlightTrip.RoundTrip && event.type === 'set' && selectedDate) {
      dispatch(dateChanged({ departureDate: departureDate || '', returnDate: selectedDate.toString() }))
    }
  }

  const handleBooking = () => {
    if (trip === FlightTrip.OneWay) {
      Alert.alert('One-Way Flight Booked', `Your one-way flight for ${departureDate} has been successfully booked`)
    }
    else {
      Alert.alert('Round-trip Flight Booked', `Your round-trip flight has been successfully booked. Departure on ${departureDate}, returning on ${returnDate}`)
    }
  }

  return (
    <View style={[commonStyles.container, styles.container]}>
      <Dropdown
        label="Flight Type"
        items={flightOptions}
        value={trip}
        onValueChange={value => handleFlightTypeChange(value as FlightTrip)}
        containerStyle={styles.inputSpacing}
      />
      <DatePicker
        label="Start Date"
        value={departureDate ? new Date(departureDate) : new Date()}
        onChange={handleStartDateChange}
        mode="date"
        containerStyle={styles.inputSpacing}
      // minimumDate={new Date()} // Optional: Prevent past dates
      />
      <DatePicker
        label="Return Date"
        value={returnDate ? new Date(returnDate) : new Date()} // Provide a fallback value if null for picker
        onChange={handleReturnDateChange}
        mode="date"
        disabled={trip === FlightTrip.OneWay} // Disable if one-way
        containerStyle={styles.inputSpacing}
        minimumDate={new Date()} // Return cannot be before start
      />
      <Button
        title="Book Flight"
        onPress={handleBooking}
        disabled={isBookableFlight}
        style={styles.bookButton}
      />
    </View>
  )
}
