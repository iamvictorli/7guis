import { useAppDispatch, useAppSelector } from '~/store'
import { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import {
  durationChanged,
  nowChanged,
  selectDuration,
  selectElapsedMs,
  timerReset,
} from 'state/timerSlice'

// TODO: middleware? listener middleware?
// set into redux middleware b/c of interval side effects
function Timer() {
  const intervalRef = useRef<ReturnType<typeof setInterval>>()
  const dispatch = useAppDispatch()
  const duration = useAppSelector(selectDuration)
  const elapsedMs = useSelector(selectElapsedMs)

  const startTimer = useCallback(() => {
    clearInterval(intervalRef.current)

    dispatch(nowChanged(new Date().getTime()))

    intervalRef.current = setInterval(() => {
      dispatch(nowChanged(new Date().getTime()))
    }, 100)
  }, [dispatch])

  function stopTimer() {
    clearInterval(intervalRef.current)
  }

  useEffect(() => {
    dispatch(timerReset())
    startTimer()

    return () => {
      stopTimer()
    }
  }, [dispatch, startTimer])

  // clear interval after a min
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      stopTimer()
    }, 60 * 1000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  const seconds = Math.floor(elapsedMs / 1000)
  const decisecond = Math.trunc(Math.floor(elapsedMs % 1000) / 100)

  return (
    <>
      <meter min={0} max={duration} value={elapsedMs} />

      <div>
        {seconds}.{decisecond}s
      </div>
      <input
        type="range"
        min={0}
        max={30000}
        value={duration}
        onChange={(e) => dispatch(durationChanged(Number(e.target.value)))}
      />
      <button
        onClick={() => {
          dispatch(timerReset())
          startTimer()
        }}>
        Reset
      </button>
    </>
  )
}

export default Timer
