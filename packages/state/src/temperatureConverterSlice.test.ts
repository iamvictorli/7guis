import { describe, expect, it } from 'vitest'

import { initialState, name, reducer, selectTemperatures, temperatureChanged } from './temperatureConverterSlice'

describe('temperatureConverterSlice', () => {
  it('should update fahrenheit when Celsius is changed and compute Fahrenheit correctly', () => {
    // Celsius to Fahrenheit: (C × 9/5) + 32
    const celsiusInput = '0'
    const state = reducer(initialState, temperatureChanged({ temperatureType: 'celsius', value: celsiusInput }))

    expect(selectTemperatures({ [name]: state })).toEqual({
      celsius: celsiusInput,
      fahrenheit: '32',
    })
  })

  it('should update celsius when Fahrenheit is changed and compute Celsius correctly', () => {
    // Fahrenheit to Celsius: (F - 32) × 5/9
    const fahrenheitInput = '32'
    const state = reducer(initialState, temperatureChanged({ temperatureType: 'fahrenheit', value: fahrenheitInput }))
    expect(selectTemperatures({ [name]: state })).toEqual({
      celsius: '0',
      fahrenheit: fahrenheitInput,
    })
  })

  it('should correctly convert a decimal Celsius value to Fahrenheit', () => {
    // 100.5°C should convert to (100.5*9/5)+32 = 212.9°F
    const state = reducer(initialState, temperatureChanged({ temperatureType: 'celsius', value: '100.5' }))
    expect(selectTemperatures({ [name]: state })).toEqual({
      celsius: '100.5',
      fahrenheit: '212.9',
    })
  })

  it('should correctly convert a decimal Fahrenheit value to Celsius', () => {
    // 98.6°F should convert to (98.6-32)*5/9 = 37°C
    const state = reducer(initialState, temperatureChanged({ temperatureType: 'fahrenheit', value: '98.6' }))
    expect(selectTemperatures({ [name]: state })).toEqual({
      fahrenheit: '98.6',
      celsius: '37',
    })
  })

  it('should reset both fields to empty string when Celsius input is empty', () => {
    // When the Celsius field is cleared, both fields should reset.
    const state = reducer({ fahrenheit: '100', celsius: '25' }, temperatureChanged({ temperatureType: 'celsius', value: '' }))
    expect(selectTemperatures({ [name]: state })).toEqual({
      celsius: '',
      fahrenheit: '',
    })
  })

  it('should reset both fields to empty string when Fahrenheit input is empty', () => {
    // When the Fahrenheit field is cleared, both fields should reset.
    const state = reducer({ fahrenheit: '50', celsius: '10' }, temperatureChanged({ temperatureType: 'fahrenheit', value: '' }))
    expect(selectTemperatures({ [name]: state })).toEqual({
      celsius: '',
      fahrenheit: '',
    })
  })
})
