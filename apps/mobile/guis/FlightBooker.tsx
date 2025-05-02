import type { DateTimePickerEvent } from '@react-native-community/datetimepicker'

import React from 'react'
import { Alert, StyleSheet, View } from 'react-native'

import { dateChanged, FlightTrip, flightTypeChanged, selectFlightBookerState, selectIsBookableFlight } from '@victorli/7guis-state/flightBookerSlice'
import { useAppDispatch, useAppSelector } from '@victorli/7guis-state/hooks'
import { Button } from '@victorli/7guis-ui-mobile/Button'
import { DatePicker } from '@victorli/7guis-ui-mobile/DatePicker'
import { Dropdown } from '@victorli/7guis-ui-mobile/Dropdown'
import { theme } from '@victorli/7guis-ui-mobile/theme'
import { commonStyles } from '~/styles/commonStyles'

const styles = StyleSheet.create({
  bookButton: {
    alignSelf: 'center', // Center the button
    marginTop: theme.spacing.l, // Space above the button
    minWidth: 180,
  },
  container: {
    padding: theme.spacing.l,
  },
  inputSpacing: {
    marginBottom: theme.spacing.l, // Space between inputs
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
      Alert.alert('One-Way Flight Booked', `Your one-way flight for ${departureDate || new Date().toString()} has been successfully booked`)
    }
    else {
      Alert.alert('Round-trip Flight Booked', `Your round-trip flight has been successfully booked. Departure on ${departureDate || new Date().toString()}, returning on ${returnDate || (departureDate || new Date().toString())}`)
    }
  }

  let returnDatePickerValue = new Date()

  if (!returnDate) {
    if (departureDate)
      returnDatePickerValue = new Date(departureDate)
    else returnDatePickerValue = new Date()
  }
  else {
    if (departureDate)
      returnDatePickerValue = new Date(Math.max(new Date(departureDate).getTime(), new Date(returnDate).getTime()))
    else returnDatePickerValue = new Date(returnDate)
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
        value={returnDatePickerValue}
        onChange={handleReturnDateChange}
        mode="date"
        disabled={trip === FlightTrip.OneWay} // Disable if one-way
        containerStyle={styles.inputSpacing}
        minimumDate={departureDate ? new Date(departureDate) : new Date()} // Return cannot be before start
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
