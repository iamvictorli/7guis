import { describe, expect, it } from 'vitest'

import { increment, initialState, name, reducer, selectCount } from './counterSlice'

describe('counterSlice', () => {
  it('should increment the counter by the specified positive number', () => {
    // Testing a typical positive increment.
    const state = reducer(initialState, increment(5))
    expect(selectCount({ [name]: state })).toBe(5)
  })

  it('should handle negative increments', () => {
    // Negative values are allowed, effectively decreasing the count.
    const state = reducer(initialState, increment(-3))
    expect(selectCount({ [name]: state })).toBe(-3)
  })

  it('should handle zero increment', () => {
    // Zero should not change the state.
    const state = reducer(initialState, increment(0))
    expect(selectCount({ [name]: state })).toBe(0)
  })

  it('should support multiple increments in sequence', () => {
    // Testing that multiple sequential increments accumulate correctly.
    let state = initialState
    state = reducer(state, increment(2))
    state = reducer(state, increment(3))
    state = reducer(state, increment(5))

    expect(selectCount({ [name]: state })).toBe(10)
  })
})
