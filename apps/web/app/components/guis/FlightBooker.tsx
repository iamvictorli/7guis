import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { ArrowRightIcon, WidthIcon } from '@radix-ui/react-icons'
import { Label } from '@radix-ui/react-label'
import { Button, Flex, Select, Text } from '@radix-ui/themes'

import {
  dateChanged,
  FlightTrip,
  flightTypeChanged,
  selectFlightBookerState,
  selectIsBookableFlight,
} from '@7guis/state/flightBookerSlice'
import { DatePicker } from '~/components/DatePicker/DatePicker'
import { DateRangePicker } from '~/components/DatePicker/DateRangePicker'
import { useToast } from '~/hooks/useToast'
import { useAppDispatch, useAppSelector } from '~/store'

/**
 * Retrieves the range picker value based on departure and return dates.
 */
function getRangePickerValue(departureDate: string | null, returnDate: string | null) {
  if (!departureDate)
    return null
  return {
    start: parseDate(departureDate),
    end: returnDate ? parseDate(returnDate) : null,
  }
}

/**
 * Flight booking form that conditionally displays a one-way or round-trip UI.
 * It integrates date pickers and toast notifications to provide feedback on booking.
 */
export default function FlightBooker() {
  const dispatch = useAppDispatch()
  const { departureDate, returnDate, trip } = useAppSelector(selectFlightBookerState)
  const isBookableFlight = useAppSelector(selectIsBookableFlight)
  const { toast } = useToast()

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
          onValueChange={value => dispatch(flightTypeChanged(value as FlightTrip))}
        >
          <Select.Trigger id="flight-trip" aria-label="Select Flight Type">
            <Flex as="span" align="center" gap="2">
              {trip === FlightTrip.OneWay ? <ArrowRightIcon /> : <WidthIcon />}
              <Text size="3">{trip}</Text>
            </Flex>
          </Select.Trigger>
          <Select.Content position="popper">
            <Select.Group>
              <Select.Item value={FlightTrip.OneWay}>{FlightTrip.OneWay}</Select.Item>
              <Select.Item value={FlightTrip.RoundTrip}>{FlightTrip.RoundTrip}</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Flex>

      {trip === FlightTrip.OneWay
        ? (
            <DatePicker
              label="Departure Date"
              minValue={today(getLocalTimeZone())}
              value={departureDate ? parseDate(departureDate) : null}
              onChange={(value) => {
                dispatch(dateChanged({ departureDate: value?.toString() || '' }))
              }}
            />
          )
        : (
            <DateRangePicker
              label="Departure and Return Dates"
              minValue={today(getLocalTimeZone())}
              // @ts-expect-error: both departure and return dates could be null.
              value={getRangePickerValue(departureDate, returnDate)}
              onChange={(dateValue) => {
                if (!dateValue)
                  return
                const { start, end } = dateValue
                dispatch(
                  dateChanged({
                    departureDate: start?.toString() || '',
                    returnDate: end?.toString() || '',
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
            toast({
              title: 'One-Way Flight Booked',
              description: `Your one-way flight for ${departureDate} has been successfully booked`,
            })
          }
          else {
            toast({
              title: 'Round-trip Flight Booked',
              description: `Your round-trip flight has been successfully booked. Departure on ${departureDate}, returning on ${returnDate}`,
            })
          }
        }}
      >
        Book
      </Button>
    </Flex>
  )
}
