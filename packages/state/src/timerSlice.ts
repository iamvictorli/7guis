import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

export interface TimerState {
  duration: number
  start: number
  now: number
}

export const initialState: TimerState = {
  duration: 15 * 1000, // Default duration of 15 seconds.
  start: new Date().getTime(),
  now: new Date().getTime(),
}

/**
 * Timer slice.
 *
 * Manages timer state, including resetting the timer, updating the current time,
 * and adjusting the duration.
 * Actions:
 * - durationChanged: Change the timer duration.
 * - nowChanged: Updates the current time
 * - timerReset: Resets the timer state.
 */
const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {

    /**
     * Change the timer duration.
     */
    durationChanged: (state, action: PayloadAction<number>) => {
      state.duration = action.payload
    },

    /**
     * Updates the current time.
     */
    nowChanged: (state, action: PayloadAction<number>) => {
      state.now = action.payload
    },

    /**
     * Reset the timer.
     */
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
