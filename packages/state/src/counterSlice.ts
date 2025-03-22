import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

export interface CounterState {
  count: number
}

export const initialState: CounterState = {
  count: 0,
}

/**
 * Counter slice.
 *
 * Provides actions and reducers for managing a numeric counter.
 * Actions:
 * - increment: Increase the counter by a specified value.
 */
const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    /**
     * Increment the counter by an amount
     */
    increment: (state, action: PayloadAction<number>) => {
      const incrementBy = action.payload
      state.count += incrementBy
    },
  },
  selectors: {
    selectCount: state => state.count,
  },
})

export const { name, reducer } = counterSlice

const { actions, selectors } = counterSlice
export const { increment } = actions
export const { selectCount } = selectors
