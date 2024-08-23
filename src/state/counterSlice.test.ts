import { expect, test } from 'vitest'

import reducer, { increment, initialState } from './counterSlice'

test('should increment', () => {
  expect(reducer(initialState, increment())).toEqual({ count: 1 })
})
