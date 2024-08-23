import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
  count: number
}

export const initialState: CounterState = {
  count: 0,
} satisfies CounterState as CounterState

const counterSlice = createSlice({
  name: 'counter',
  initialState,
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

export const COUNTER_REDUCER_NAME = counterSlice.name

export default counterSlice.reducer
