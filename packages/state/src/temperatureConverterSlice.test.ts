import { expect, it } from 'vitest'

import {
  initialState,
  name,
  reducer,
  selectTemperatures,
  temperatureChanged,
} from './temperatureConverterSlice'

it('should update fahrenheit when celcius is changed', () => {
  let state = initialState
  expect(selectTemperatures({ [name]: state })).toEqual({
    ...initialState,
  })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'celcius', value: '10' }),
  )
  expect(selectTemperatures({ [name]: state })).toEqual({
    celcius: '10',
    fahrenheit: '50',
  })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'celcius', value: '25' }),
  )
  expect(selectTemperatures({ [name]: state })).toEqual({
    celcius: '25',
    fahrenheit: '77',
  })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'celcius', value: '0' }),
  )
  expect(selectTemperatures({ [name]: state })).toEqual({
    celcius: '0',
    fahrenheit: '32',
  })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'celcius', value: '' }),
  )
  expect(selectTemperatures({ [name]: state })).toEqual({
    celcius: '',
    fahrenheit: '',
  })
})

it('should update celcius when fahrenheit is changed', () => {
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
    celcius: '20',
  })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'fahrenheit', value: '95' }),
  )
  expect(selectTemperatures({ [name]: state })).toEqual({
    fahrenheit: '95',
    celcius: '35',
  })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'fahrenheit', value: '50' }),
  )
  expect(selectTemperatures({ [name]: state })).toEqual({
    fahrenheit: '50',
    celcius: '10',
  })

  state = reducer(
    state,
    temperatureChanged({ temperatureType: 'fahrenheit', value: '' }),
  )
  expect(selectTemperatures({ [name]: state })).toEqual({
    fahrenheit: '',
    celcius: '',
  })
})
