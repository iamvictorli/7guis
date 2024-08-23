import {
  celciusChanged,
  fahrenheitChanged,
  selectTemperatures,
} from '../state/temperatureConverterSlice'
import { useAppDispatch, useAppSelector } from '../store'

function TemperatureConverter() {
  const dispatch = useAppDispatch()
  const { celcius, fahrenheit } = useAppSelector(selectTemperatures)
  return (
    <div>
      <input
        value={celcius}
        onChange={event => {
          dispatch(celciusChanged(event.currentTarget.value))
        }}
      />
      <span>Celcius</span>
      <input
        value={fahrenheit}
        onChange={event => {
          dispatch(fahrenheitChanged(event.currentTarget.value))
        }}
      />
      <span>Fahrenheit</span>
    </div>
  )
}

export default TemperatureConverter
