import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

interface TimerState {
  start: number
  now: number
  duration: number
}

const initialState: TimerState = {
  start: new Date().getTime(),
  now: new Date().getTime(),
  duration: 15000,
} satisfies TimerState as TimerState

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    durationChanged: (state, action: PayloadAction<number>) => {
      state.duration = action.payload
    },
    nowChanged: (state, action: PayloadAction<number>) => {
      state.now = action.payload
    },
    timerReset: {
      // using prepare callback to get the current timestamp
      reducer: (state, action: PayloadAction<number>) => {
        state.start = action.payload
      },
      prepare: () => {
        return {
          payload: new Date().getTime(),
        }
      },
    },
  },
  selectors: {
    selectDuration: state => state.duration,
    selectElapsedMs: ({ now, start, duration }) => {
      // compares the time difference between now time and start time to the current duration
      const timeDifference = now - start
      if (timeDifference >= duration) {
        return duration
      }
      else {
        return timeDifference
      }
    },
  },
})

export const { name, reducer } = timerSlice

const { actions, selectors } = timerSlice
export const { durationChanged, timerReset, nowChanged } = actions
export const { selectDuration, selectElapsedMs } = selectors
