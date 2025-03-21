import { describe, expect, it, vi } from 'vitest'

import { durationChanged, initialState, name, nowChanged, reducer, selectDuration, selectElapsedMs, timerReset } from './timerSlice'

describe('timerSlice', () => {
  describe('reducers', () => {
    it('should update the timer duration when durationChanged is dispatched', () => {
      const newDuration = 30 * 1000
      const state = reducer(initialState, durationChanged(newDuration))
      expect(selectDuration({ [name]: state })).toBe(newDuration)
    })

    it('should update the current time when nowChanged is dispatched', () => {
      const elapsed = 10 * 1000
      const newNow = initialState.now + elapsed
      const state = reducer(initialState, nowChanged(newNow))
      expect(selectElapsedMs({ [name]: state })).toBe(elapsed)
    })

    describe('timerReset', () => {
      it('should reset the timer start to the current time', () => {
        // https://vitest.dev/guide/mocking.html#timers
        vi.useFakeTimers()
        const fakeTime = 200000
        // https://vitest.dev/api/vi.html#vi-setsystemtime
        vi.setSystemTime(fakeTime)

        const state = reducer(initialState, timerReset())
        expect(state.start).toBe(fakeTime)

        vi.useRealTimers()
      })
    })
  })

  describe('selectors', () => {
    it('selectDuration should return the correct duration', () => {
      const duration = 25 * 1000
      const state = {
        ...initialState,
        duration,
      }
      expect(selectDuration({ [name]: state })).toBe(duration)
    })

    it('selectElapsedMs should return the difference when elapsed time is less than duration', () => {
      const state = {
        duration: 15000,
        start: 100000,
        now: 100500, // 500ms elapsed
      }
      expect(selectElapsedMs({ [name]: state })).toBe(500)
    })

    it('selectElapsedMs should return duration when elapsed time exceeds duration', () => {
      const state = {
        duration: 15000,
        start: 100000,
        now: 120000, // 20000ms elapsed which is > duration
      }
      expect(selectElapsedMs({ [name]: state })).toBe(15000)
    })

    it('selectElapsedMs should return 0 when start equals now', () => {
      const state = {
        duration: 15000,
        start: 100000,
        now: 100000,
      }
      expect(selectElapsedMs({ [name]: state })).toBe(0)
    })

    it('selectElapsedMs should return negative value if now is less than start (edge case)', () => {
      const state = {
        duration: 15000,
        start: 100000,
        now: 99000,
      }
      // In this implementation, the selector will return now - start, i.e., -1000.
      expect(selectElapsedMs({ [name]: state })).toBe(-1000)
    })
  })
})
