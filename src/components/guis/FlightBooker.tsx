import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { ArrowRightIcon, WidthIcon } from '@radix-ui/react-icons'
import { Label } from '@radix-ui/react-label'
import { Button, Flex, Select, Text } from '@radix-ui/themes'
import { useAppDispatch, useAppSelector } from '~/store'

import {
  dateChanged,
  FlightTrip,
  flightTypeChanged,
  selectFlightBookerState,
  selectIsBookableFlight,
} from 'state/flightBookerSlice'

import { DatePicker } from '../DatePicker/DatePicker'
import { DateRangePicker } from '../DatePicker/DateRangePicker'

/**
 * Retrieves the range picker value based on the departure and return dates.
 */
function getRangePickerValue(
  departureDate: string | null,
  returnDate: string | null,
) {
  if (!departureDate) return null
  return {
    start: parseDate(departureDate),
    end: returnDate ? parseDate(returnDate) : null,
  }
}

export default function FlightBooker() {
  const dispatch = useAppDispatch()
  const { departureDate, returnDate, trip } = useAppSelector(
    selectFlightBookerState,
  )
  const isBookableFlight = useAppSelector(selectIsBookableFlight)

  // TODO: allow for multiple toast for after submitting what was booked

  // TODOs for Building a Flight Booker
  // While working on the flight booker, I’ve taken inspiration from popular flight booking sites like Google Flights and Capital One Travel. Below are some key tasks I need to implement, following their design principles:

  // Range Calendar Behavior: When a start date is selected but no end date is chosen, only the start date should be highlighted on the date range picker.
  // Consistent Date Picker Sizing: The one-way date picker should maintain the same width as the date range picker for visual consistency.
  // Date Format Display: The selected dates should be displayed using abbreviated formats, like this: "Tue, Sep 3" (weekday, month name, and day).
  // Continuous Month View: The date picker popover should display two months side by side for easy navigation.
  // Mobile Design Considerations: On mobile devices, the date picker popover should take up the entire screen. Instead of "next" and "previous" buttons, users should be able to scroll through the months seamlessly.

  return (
    <Flex direction="column" gap="4" align="start">
      <Flex direction="column" gap="1">
        <Label htmlFor="flight-trip" asChild>
          <Text as="label" size="3">
            Flight Type
          </Text>
        </Label>
        <Select.Root
          value={trip}
          onValueChange={(value) => {
            dispatch(flightTypeChanged(value as FlightTrip))
          }}>
          <Select.Trigger id="flight-trip">
            <Flex as="span" align="center" gap="2">
              {trip === FlightTrip.OneWay ? <ArrowRightIcon /> : <WidthIcon />}
              <Text size="3">{trip}</Text>
            </Flex>
          </Select.Trigger>
          <Select.Content position="popper">
            <Select.Group>
              <Select.Item value={FlightTrip.OneWay}>
                {FlightTrip.OneWay}
              </Select.Item>
              <Select.Item value={FlightTrip.RoundTrip}>
                {FlightTrip.RoundTrip}
              </Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Flex>

      {trip === FlightTrip.OneWay ? (
        <DatePicker
          label="Departure Date"
          minValue={today(getLocalTimeZone())}
          value={departureDate ? parseDate(departureDate) : null}
          onChange={(value) => {
            dispatch(
              dateChanged({
                departureDate: value.toString(),
              }),
            )
          }}
        />
      ) : (
        <DateRangePicker
          label="Deparature and Return Dates"
          minValue={today(getLocalTimeZone())}
          // @ts-expect-error both departure date and return date could be null, and the types expect both to be a DateValue and not null
          value={getRangePickerValue(departureDate, returnDate)}
          onChange={({ start, end }) => {
            dispatch(
              dateChanged({
                departureDate: start.toString(),
                returnDate: end.toString(),
              }),
            )
          }}
        />
      )}

      <Button
        disabled={!isBookableFlight}
        size="3"
        onClick={() => {
          if (trip === FlightTrip.OneWay) {
            console.log(`You have booked a one-way flight for ${departureDate}`)
          } else {
            console.log(
              `You have booked a return flight from ${departureDate} to ${returnDate}`,
            )
          }
        }}>
        Book
      </Button>
    </Flex>
  )
}
