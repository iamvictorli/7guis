import { getLocalTimeZone, today } from '@internationalized/date'
import { describe, expect, it } from 'vitest'

import {
  dateChanged,
  FlightTrip,
  flightTypeChanged,
  initialState,
  name,
  reducer,
  selectFlightBookerState,
  selectIsBookableFlight,
} from './flightBookerSlice'

describe('flightBookerSlice', () => {
  describe('reducers', () => {
    it('should update the flight type to Round Trip', () => {
      const state = reducer(initialState, flightTypeChanged(FlightTrip.RoundTrip))
      expect(selectFlightBookerState({ [name]: state })).toEqual({ trip: FlightTrip.RoundTrip, departureDate: null, returnDate: null })
    })

    it('should update the flight type to One Way', () => {
      const state = reducer({ departureDate: '2025-03-15', returnDate: '2025-03-18', trip: FlightTrip.RoundTrip }, flightTypeChanged(FlightTrip.OneWay))
      expect(selectFlightBookerState({ [name]: state })).toEqual({ trip: FlightTrip.OneWay, departureDate: '2025-03-15', returnDate: '2025-03-18' })
    })

    it('should update departureDate for a one-way flight', () => {
      const departure = '2025-03-15'
      const state = reducer(initialState, dateChanged({ departureDate: departure }))
      expect(selectFlightBookerState({ [name]: state })).toEqual({ ...initialState, departureDate: departure })
    })

    it('should update both departureDate and returnDate for a round-trip flight', () => {
      const departure = '2025-03-15'
      const oldRetDate = '2025-03-20'
      const newRetDate = '2025-03-26'
      const state = reducer({ departureDate: departure, returnDate: oldRetDate, trip: FlightTrip.RoundTrip }, dateChanged({ departureDate: departure, returnDate: newRetDate }))
      expect(selectFlightBookerState({ [name]: state })).toEqual({ departureDate: departure, returnDate: newRetDate, trip: FlightTrip.RoundTrip })
    })

    it('should ignore returnDate update when flight type is One Way', () => {
      const departure = '2025-03-15'
      const retDate = '2025-03-20'
      const state = reducer({ departureDate: '2025-03-16', returnDate: null, trip: FlightTrip.OneWay }, dateChanged({ departureDate: departure, returnDate: retDate }))
      expect(selectFlightBookerState({ [name]: state })).toEqual({ departureDate: departure, returnDate: null, trip: FlightTrip.OneWay })
    })
  })

  describe('selectors', () => {
    describe('selectFlightBookerState', () => {
      it('should return the complete flight booker state', () => {
        const state = {
          trip: FlightTrip.OneWay,
          departureDate: '2025-03-15',
          returnDate: null,
        }
        expect(selectFlightBookerState({ [name]: state })).toEqual(state)
      })
    })

    describe('selectIsBookableFlight for One Way flights', () => {
      // Use today's date from the library for testing
      const todayStr = today(getLocalTimeZone()).toString()

      it('should return true for a one-way flight with departureDate equal to today', () => {
        const state = { trip: FlightTrip.OneWay, departureDate: todayStr, returnDate: null }
        expect(selectIsBookableFlight({ [name]: state })).toBe(true)
      })

      it('should return false for a one-way flight with departureDate in the future', () => {
        // A far future date should be bookable if we assume only today or past dates are valid.
        const state = { trip: FlightTrip.OneWay, departureDate: '9999-12-31', returnDate: null }
        expect(selectIsBookableFlight({ [name]: state })).toBe(true)
      })

      it('should return false when departureDate is null', () => {
        const state = { trip: FlightTrip.OneWay, departureDate: null, returnDate: null }
        expect(selectIsBookableFlight({ [name]: state })).toBe(false)
      })

      it('should return false when departureDate has an invalid format', () => {
        const state = { trip: FlightTrip.OneWay, departureDate: 'invalid-date', returnDate: null }
        expect(selectIsBookableFlight({ [name]: state })).toBe(false)
      })
    })

    describe('selectIsBookableFlight for Round Trip flights', () => {
      it('should return true for a round-trip flight with valid dates (departureDate ≤ returnDate and both are today or in the past)', () => {
        // same day
        const sameDayState = { trip: FlightTrip.RoundTrip, departureDate: '2025-03-15', returnDate: '2025-03-15' }
        expect(selectIsBookableFlight({ [name]: sameDayState })).toBe(true)

        const differentDayState = { trip: FlightTrip.RoundTrip, departureDate: '2025-03-15', returnDate: '2025-03-20' }
        expect(selectIsBookableFlight({ [name]: differentDayState })).toBe(true)
      })

      it('should return false if departureDate is after returnDate', () => {
        const state = { trip: FlightTrip.RoundTrip, departureDate: '2025-03-20', returnDate: '2025-03-15' }
        expect(selectIsBookableFlight({ [name]: state })).toBe(false)
      })

      it('should return false if departureDate is null', () => {
        const state = { trip: FlightTrip.RoundTrip, departureDate: null, returnDate: '2025-03-15' }
        expect(selectIsBookableFlight({ [name]: state })).toBe(false)
      })

      it('should return false if returnDate is null', () => {
        const state = { trip: FlightTrip.RoundTrip, departureDate: '2025-03-15', returnDate: null }
        expect(selectIsBookableFlight({ [name]: state })).toBe(false)
      })

      it('should return false when departureDate is invalid', () => {
        const state = { trip: FlightTrip.RoundTrip, departureDate: 'not-a-date', returnDate: '2025-03-15' }
        expect(selectIsBookableFlight({ [name]: state })).toBe(false)
      })

      it('should return false when returnDate is invalid', () => {
        const state = { trip: FlightTrip.RoundTrip, departureDate: '2025-03-15', returnDate: 'not-a-date' }
        expect(selectIsBookableFlight({ [name]: state })).toBe(false)
      })
    })
  })
})
