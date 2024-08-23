import { useAppDispatch, useAppSelector } from '~/store'

import {
  selectTemperatures,
  temperatureChanged,
} from 'state/temperatureConverterSlice'

function TemperatureConverter() {
  const dispatch = useAppDispatch()
  const { celcius, fahrenheit } = useAppSelector(selectTemperatures)
  return (
    <div>
      <input
        value={celcius}
        onChange={(event) => {
          dispatch(
            temperatureChanged({
              temperatureType: 'celcius',
              value: event.currentTarget.value,
            }),
          )
        }}
      />
      <span>Celcius</span>
      <input
        value={fahrenheit}
        onChange={(event) => {
          dispatch(
            temperatureChanged({
              temperatureType: 'fahrenheit',
              value: event.currentTarget.value,
            }),
          )
        }}
      />
      <span>Fahrenheit</span>
    </div>
  )
}

export default TemperatureConverter
