import type { PayloadAction } from '@reduxjs/toolkit'

import { parseDate } from '@internationalized/date'
import { createSlice } from '@reduxjs/toolkit'

/**
 * Determines if the selected date is the same or after the reference date.
 */
function isSameOrAfter(
  selectedDate: string | null,
  referenceDate: string | null,
) {
  if (selectedDate === null || referenceDate === null)
    return false

  return parseDate(selectedDate).compare(parseDate(referenceDate)) >= 0
}

export enum FlightTrip {
  OneWay = 'One Way',
  RoundTrip = 'Round Trip',
}

interface FlightBookerState {
  trip: FlightTrip
  departureDate: string | null // will be in YYYY-MM-DD format
  returnDate: string | null
}

export const initialState: FlightBookerState = {
  trip: FlightTrip.OneWay,
  departureDate: null,
  returnDate: null,
}

/**
 * FlightBooker slice.
 *
 * Manages the flight booking state, including the selected flight type and dates.
 * Actions:
 * - flightTypeChanged: Update the flight type.
 * - dateChanged: Update the departure and/or return dates.
 */
const flightBookerSlice = createSlice({
  name: 'flight-booker',
  initialState,
  reducers: {
    /**
     * Change the flight type.
     */
    flightTypeChanged: (state, action: PayloadAction<FlightTrip>) => {
      state.trip = action.payload
    },

    /**
     * Change the flight dates.
     */
    dateChanged: (state, action: PayloadAction<{ departureDate: string, returnDate?: string }>) => {
      state.departureDate = action.payload.departureDate
      if (action.payload.returnDate && state.trip === FlightTrip.RoundTrip) {
        state.returnDate = action.payload.returnDate
      }
    },
  },
  selectors: {
    selectFlightBookerState: state => state,
    selectIsBookableFlight: ({ trip, departureDate, returnDate }) => {
      return (
        (trip === FlightTrip.OneWay
          && departureDate !== null
          && departureDate.match(/^\d{4}-\d{2}-\d{2}$/) !== null
        )
        || (trip === FlightTrip.RoundTrip
          && departureDate !== null
          && departureDate.match(/^\d{4}-\d{2}-\d{2}$/) !== null
          && returnDate !== null
          && returnDate.match(/^\d{4}-\d{2}-\d{2}$/) !== null
          && isSameOrAfter(returnDate, departureDate)
        )
      )
    },
  },
})

export const { name, reducer } = flightBookerSlice

const { actions, selectors } = flightBookerSlice
export const { flightTypeChanged, dateChanged } = actions
export const { selectFlightBookerState, selectIsBookableFlight } = selectors
