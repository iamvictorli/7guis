import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export enum FlightTrip {
  OneWay = 'OneWay',
  RoundTrip = 'RoundTrip',
}

export enum FlightDateType {
  DEPARTURE = 'departureDate',
  RETURN = 'returnDate',
}

interface FlightBookerState {
  departureDate: string
  returnDate: string
  trip: FlightTrip
}

const initialState: FlightBookerState = {
  departureDate: new Date().toISOString().substring(0, 10),
  returnDate: new Date().toISOString().substring(0, 10),
  trip: FlightTrip.OneWay,
} satisfies FlightBookerState as FlightBookerState

const flightBookerSlice = createSlice({
  name: 'flight-booker',
  initialState,
  reducers: {
    flightTypeChanged: (state, action: PayloadAction<FlightTrip>) => {
      state.trip = action.payload
    },
    dateChanged: (
      state,
      action: PayloadAction<{ date: string; flightDateType: FlightDateType }>,
    ) => {
      const { flightDateType, date } = action.payload
      if (flightDateType === FlightDateType.DEPARTURE) {
        state.departureDate = date
      } else if (flightDateType === FlightDateType.RETURN) {
        state.returnDate = date
      }
    },
  },
  selectors: {
    selectFlightBookerState: state => state,
    selectIsBookableFlight: ({ trip, departureDate, returnDate }) => {
      return trip === FlightTrip.OneWay || departureDate <= returnDate
    },
  },
})

export const { selectFlightBookerState, selectIsBookableFlight } =
  flightBookerSlice.selectors

export const { flightTypeChanged, dateChanged } = flightBookerSlice.actions

export const FLIGHT_BOOKER_REDUCER_NAME = flightBookerSlice.name

export default flightBookerSlice.reducer
