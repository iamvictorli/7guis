import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

type TemperatureType = 'fahrenheit' | 'celsius'

export interface TemperatureConverterState {
  fahrenheit: string
  celsius: string
}

export const initialState: TemperatureConverterState = {
  fahrenheit: '',
  celsius: '',
} satisfies TemperatureConverterState as TemperatureConverterState

/**
 * Temperature converter slice for managing temperature conversion between Celsius and Fahrenheit.
 *
 * Features:
 * - Automatically updates the corresponding field when a value is entered.
 * - Uses standard conversion formulas:
 *   - Celsius to Fahrenheit: (C × 9/5) + 32
 *   - Fahrenheit to Celsius: (F - 32) × 5/9
 * - Supports empty input handling, resetting values when fields are cleared.
 */
const temperatureConverterSlice = createSlice({
  name: 'temperature-converter',
  initialState,
  reducers: {

    /**
     * Handles changes in the temperature input field.
     *
     * If the user updates the Celsius field, it converts the value to Fahrenheit.
     * If the user updates the Fahrenheit field, it converts the value to Celsius.
     *
     * - If the input is empty, both values are reset to an empty string.
     */
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
        state.celsius
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
