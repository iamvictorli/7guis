import { expect, it } from 'vitest'

import {
  initialState,
  name,
  reducer,
  selectTemperatures,
  temperatureChanged,
} from './temperatureConverterSlice'

it('should update fahrenheit when celsius is changed', () => {
  let state = initialState
  expect(selectTemperatures({ [name]: state })).toEqual({
    ...initialState,
  })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'celsius', value: '10' }),
  )
  expect(selectTemperatures({ [name]: state })).toEqual({
    celsius: '10',
    fahrenheit: '50',
  })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'celsius', value: '25' }),
  )
  expect(selectTemperatures({ [name]: state })).toEqual({
    celsius: '25',
    fahrenheit: '77',
  })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'celsius', value: '0' }),
  )
  expect(selectTemperatures({ [name]: state })).toEqual({
    celsius: '0',
    fahrenheit: '32',
  })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'celsius', value: '' }),
  )
  expect(selectTemperatures({ [name]: state })).toEqual({
    celsius: '',
    fahrenheit: '',
  })
})

it('should update celsius when fahrenheit is changed', () => {
  let state = initialState
  expect(selectTemperatures({ [name]: state })).toEqual({
    ...initialState,
  })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'fahrenheit', value: '68' }),
  )
  expect(selectTemperatures({ [name]: state })).toEqual({
    fahrenheit: '68',
    celsius: '20',
  })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'fahrenheit', value: '95' }),
  )
  expect(selectTemperatures({ [name]: state })).toEqual({
    fahrenheit: '95',
    celsius: '35',
  })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'fahrenheit', value: '50' }),
  )
  expect(selectTemperatures({ [name]: state })).toEqual({
    fahrenheit: '50',
    celsius: '10',
  })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'fahrenheit', value: '' }),
  )
  expect(selectTemperatures({ [name]: state })).toEqual({
    fahrenheit: '',
    celsius: '',
  })
})
