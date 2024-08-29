import { useAppDispatch, useAppSelector } from '~/store'

import {
  dateChanged,
  FlightDateType,
  FlightTrip,
  flightTypeChanged,
  selectFlightBookerState,
  selectIsBookableFlight,
} from 'state/flightBookerSlice'

export default function FlightBooker() {
  const dispatch = useAppDispatch()
  const { departureDate, returnDate, trip } = useAppSelector(
    selectFlightBookerState,
  )
  const isBookableFlight = useAppSelector(selectIsBookableFlight)

  return (
    <>
      <select
        value={trip}
        onChange={(event) => {
          const flightType =
            (event.currentTarget.value as FlightTrip) === FlightTrip.OneWay
              ? FlightTrip.OneWay
              : FlightTrip.RoundTrip

          dispatch(flightTypeChanged(flightType))
        }}>
        <option value={FlightTrip.OneWay}>One Way</option>
        <option value={FlightTrip.RoundTrip}>Round Trip</option>
      </select>
      <input
        type="date"
        value={departureDate}
        onChange={(event) => {
          dispatch(
            dateChanged({
              flightDateType: FlightDateType.DEPARTURE,
              date: event.currentTarget.value,
            }),
          )
        }}
      />
      <input
        type="date"
        value={returnDate}
        onChange={(event) => {
          dispatch(
            dateChanged({
              flightDateType: FlightDateType.RETURN,
              date: event.currentTarget.value,
            }),
          )
        }}
        disabled={trip === FlightTrip.OneWay}
      />
      <button
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
      </button>
    </>
  )
}
