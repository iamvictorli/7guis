import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
  count: number
}

export const counterInitialState: CounterState = {
  count: 0,
} satisfies CounterState as CounterState

const counterSlice = createSlice({
  name: 'counter',
  initialState: counterInitialState,
  reducers: {
    increment: (state, action: PayloadAction<number>) => {
      const incrementBy = action.payload
      state.count += incrementBy
    },
  },
  selectors: {
    selectCount: (state) => state.count,
  },
})

export const { selectCount } = counterSlice.selectors

export const { increment } = counterSlice.actions

export const counterName = counterSlice.name

export const counterReducer = counterSlice.reducer
