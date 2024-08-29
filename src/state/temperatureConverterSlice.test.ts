import { expect, test } from 'vitest'

import reducer, {
  initialState,
  temperatureChanged,
} from './temperatureConverterSlice'

test('should update fahrenheit when celcius is changed', () => {
  let state = initialState

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'celcius', value: '10' }),
  )
  expect(state).toEqual({ celcius: '10', fahrenheit: '50' })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'celcius', value: '25' }),
  )
  expect(state).toEqual({ celcius: '25', fahrenheit: '77' })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'celcius', value: '0' }),
  )
  expect(state).toEqual({ celcius: '0', fahrenheit: '32' })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'celcius', value: '' }),
  )
  expect(state).toEqual({ celcius: '', fahrenheit: '' })
})

test('should update celcius when fahrenheit is changed', () => {
  let state = initialState

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'fahrenheit', value: '68' }),
  )
  expect(state).toEqual({ fahrenheit: '68', celcius: '20' })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'fahrenheit', value: '95' }),
  )
  expect(state).toEqual({ fahrenheit: '95', celcius: '35' })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'fahrenheit', value: '50' }),
  )
  expect(state).toEqual({ fahrenheit: '50', celcius: '10' })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'fahrenheit', value: '' }),
  )
  expect(state).toEqual({ fahrenheit: '', celcius: '' })
})
