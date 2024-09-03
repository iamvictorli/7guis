import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { ArrowRightIcon, WidthIcon } from '@radix-ui/react-icons'
import { Label } from '@radix-ui/react-label'
import { Button, Flex, Select } from '@radix-ui/themes'
import { useAppDispatch, useAppSelector } from '~/store'

import {
  dateChanged,
  FlightDateType,
  FlightTrip,
  flightTypeChanged,
  selectFlightBookerState,
  selectIsBookableFlight,
} from 'state/flightBookerSlice'

import { DatePicker } from '../DatePicker/DatePicker'
import { DateRangePicker } from '../DatePicker/DateRangePicker'

export default function FlightBooker() {
  const dispatch = useAppDispatch()
  const { departureDate, returnDate, trip } = useAppSelector(
    selectFlightBookerState,
  )
  const isBookableFlight = useAppSelector(selectIsBookableFlight)

  // TODO: design first with figma
  // TODO: Date Picker should be a range, one way should have return gone
  // TODO: set initial empty
  // TODO: day name, shorten month, and day
  // TODO: show two months at a time
  // TODO: clear return date if going back to one way
  // TODO: allow for multiple toast for after submitting what was booked
  // forget about mobile design, on flight booking sites, like google flights/capital one travel, the popover takes up the whole screen, and there's a scrolldown of months instead of "next"/"prev" month buttons

  return (
    <Flex direction="column" gap="4" align="start">
      <Flex direction="column" gap="2">
        <Label htmlFor="flight-trip">Flight trip</Label>
        <Select.Root
          value={trip}
          onValueChange={(value) => {
            dispatch(flightTypeChanged(value as FlightTrip))
          }}>
          <Select.Trigger id="flight-trip">
            <Flex as="span" align="center" gap="2">
              {trip === FlightTrip.OneWay ? <ArrowRightIcon /> : <WidthIcon />}
              {trip}
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
          label="Departure"
          minValue={today(getLocalTimeZone())}
          value={parseDate(departureDate)}
          onChange={(value) => {
            dispatch(
              dateChanged({
                flightDateType: FlightDateType.DEPARTURE,
                date: value.toString(),
              }),
            )
          }}
        />
      ) : (
        <DateRangePicker
          label="Trip dates"
          minValue={today(getLocalTimeZone())}
          value={{
            start: parseDate(departureDate),
            end: parseDate(returnDate),
          }}
          onChange={({ start, end }) => {
            dispatch(
              dateChanged({
                flightDateType: FlightDateType.DEPARTURE,
                date: start.toString(),
              }),
            )
            dispatch(
              dateChanged({
                flightDateType: FlightDateType.RETURN,
                date: end.toString(),
              }),
            )
          }}
        />
      )}

      <Button
        disabled={!isBookableFlight}
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
