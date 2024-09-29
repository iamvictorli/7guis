import { expect, test } from 'vitest'

import {
  increment,
  initialState,
  name,
  reducer,
  selectCount,
} from './counterSlice'

test('count should increment', () => {
  let state = initialState
  expect(selectCount({ [name]: state })).toBe(0)

  state = reducer(state, increment(1))
  expect(selectCount({ [name]: state })).toEqual(1)

  state = reducer(state, increment(1))
  expect(selectCount({ [name]: state })).toEqual(2)

  state = reducer(state, increment(1))
  state = reducer(state, increment(1))
  expect(selectCount({ [name]: state })).toEqual(4)
})
