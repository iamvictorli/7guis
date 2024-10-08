import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

type TemperatureType = 'fahrenheit' | 'celcius'

interface TemperatureConverterState {
  fahrenheit: string
  celcius: string
}

export const initialState: TemperatureConverterState = {
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
        state.celcius
          = value === '' ? '' : ((Number.parseFloat(value) - 32) * (5 / 9)).toString()
      }
      else {
        state.fahrenheit
          = value === '' ? '' : (Number.parseFloat(value) * (9 / 5) + 32).toString()
      }
    },
  },
  selectors: {
    selectTemperatures: state => state,
  },
})

export const { name, reducer } = temperatureConverterSlice

const { actions, selectors } = temperatureConverterSlice
export const { selectTemperatures } = selectors
export const { temperatureChanged } = actions
