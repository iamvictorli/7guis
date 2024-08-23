import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface TimerState {
  start: number
  duration: number
}

const initialState: TimerState = {
  start: new Date().getTime(),
  duration: 15000,
} satisfies TimerState as TimerState

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    durationChanged: (state, action: PayloadAction<number>) => {
      state.duration = action.payload
    },
    timerReset: state => {
      state.start = new Date().getTime()
    },
  },
  selectors: {
    selectTimerState: state => state,
  },
})

export const { selectTimerState } = timerSlice.selectors

export const { durationChanged, timerReset } = timerSlice.actions

export const TIMER_REDUCER_NAME = timerSlice.name

export default timerSlice.reducer
