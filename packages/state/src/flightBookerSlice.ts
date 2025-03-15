import type { PayloadAction } from '@reduxjs/toolkit'

import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { createSlice } from '@reduxjs/toolkit'

/**
 * Determines if the selected date is the same or before the reference date.
 */
function isSameOrBefore(
  selectedDate: string | null,
  referenceDate: string | null,
) {
  if (selectedDate === null || referenceDate === null)
    return false

  return parseDate(selectedDate).compare(parseDate(referenceDate)) <= 0
}

/**
 * Checks if the given date is the same as or before today.
 */
function isSameOrBeforeToday(date: string | null) {
  if (date === null)
    return false
  const givenDate = parseDate(date).toString()
  // Get today's date
  const todayDate = today(getLocalTimeZone()).toString()

  // Compare the selected date to today
  return isSameOrBefore(todayDate, givenDate)
}

export enum FlightTrip {
  OneWay = 'One Way',
  RoundTrip = 'Round Trip',
}

interface FlightBookerState {
  departureDate: string | null // will be in YYYY-MM-DD format
  returnDate: string | null
  trip: FlightTrip
}

const initialState: FlightBookerState = {
  departureDate: null,
  returnDate: null,
  trip: FlightTrip.OneWay,
} satisfies FlightBookerState as FlightBookerState

const flightBookerSlice = createSlice({
  name: 'flight-booker',
  initialState,
  reducers: {
    flightTypeChanged: (state, action: PayloadAction<FlightTrip>) => {
      state.trip = action.payload
      // reset return date
      if (action.payload === FlightTrip.OneWay) {
        state.returnDate = null
      }
    },
    dateChanged: (
      state,
      action: PayloadAction<{
        departureDate: string
        returnDate?: string
      }>,
    ) => {
      const { departureDate, returnDate } = action.payload
      state.departureDate = departureDate
      if (returnDate) {
        state.returnDate = returnDate
      }
    },
  },
  selectors: {
    selectFlightBookerState: state => state,
    selectIsBookableFlight: ({ trip, departureDate, returnDate }) => {
      try {
        return (
          (trip === FlightTrip.OneWay
            && departureDate !== null
            && isSameOrBeforeToday(departureDate))
          || (trip === FlightTrip.RoundTrip
            && departureDate !== null
            && returnDate !== null
            && isSameOrBefore(departureDate, returnDate)
            && isSameOrBeforeToday(departureDate)
            && isSameOrBeforeToday(returnDate))
        )
      }
      catch {
        // parse date can throw an error if dates dont match YYYY-MM-DD format
        // https://github.com/adobe/react-spectrum/blob/98e21e19d50b4bf5c9114e17a75cca4c11254db0/packages/%40internationalized/date/src/string.ts#L48-L50
        return false
      }
    },
  },
})

export const { name, reducer } = flightBookerSlice

const { actions, selectors } = flightBookerSlice
export const { flightTypeChanged, dateChanged } = actions
export const { selectFlightBookerState, selectIsBookableFlight } = selectors
