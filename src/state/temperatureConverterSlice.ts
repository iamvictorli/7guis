import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type TemperatureType = 'fahrenheit' | 'celcius'

interface TemperatureConverterState {
  fahrenheit: string
  celcius: string
}

const initialState: TemperatureConverterState = {
  fahrenheit: '',
  celcius: '',
} satisfies TemperatureConverterState as TemperatureConverterState

const temperatureConverterSlice = createSlice({
  name: 'temperature-converter',
  initialState,
  reducers: {
    temperatureChanged: (
      state,
      action: PayloadAction<{
        temperatureType: TemperatureType
        value: string
      }>,
    ) => {
      const { temperatureType, value } = action.payload
      state[temperatureType] = value

      if (temperatureType === 'fahrenheit') {
        state.celcius =
          value === '' ? '' : ((parseFloat(value) - 32) * (5 / 9)).toString()
      } else {
        state.fahrenheit =
          value === '' ? '' : (parseFloat(value) * (9 / 5) + 32).toString()
      }
    },
  },
  selectors: {
    selectTemperatures: (state) => state,
  },
})

export const { selectTemperatures } = temperatureConverterSlice.selectors

export const { temperatureChanged } = temperatureConverterSlice.actions

export const TEMPERATURE_CONVERTER_REDUCER_NAME = temperatureConverterSlice.name

export default temperatureConverterSlice.reducer
