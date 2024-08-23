import { useEffect, useRef, useState } from 'react'

import {
  durationChanged,
  selectTimerState,
  timerReset,
} from '../state/timerSlice'
import { useAppDispatch, useAppSelector } from '../store'

// TODO: middleware? listener middleware?
// set into redux middleware b/c of interval side effects
function Timer() {
  const dispatch = useAppDispatch()
  const { start, duration } = useAppSelector(selectTimerState)
  const intervalRef = useRef<number>()
  const [now, setNow] = useState<number>(new Date().getTime())

  function startTimer() {
    clearInterval(intervalRef.current)

    setNow(new Date().getTime())

    intervalRef.current = setInterval(() => {
      setNow(new Date().getTime())
    }, 100)
  }

  function stopTimer() {
    clearInterval(intervalRef.current)
  }

  useEffect(() => {
    dispatch(timerReset())
    startTimer()
    return () => {
      stopTimer()
    }
  }, [dispatch])

  // clear interval after a min
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      stopTimer()
    }, 60 * 1000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  let elapsedMs
  if (now - start >= duration) {
    elapsedMs = duration
  } else {
    elapsedMs = now - start
  }

  const seconds = Math.floor(elapsedMs / 1000)
  const decisecond = Math.trunc(Math.floor(elapsedMs % 1000) / 100)

  return (
    <div>
      <meter min={0} max={duration} value={elapsedMs} />

      <div>
        {seconds}.{decisecond}s
      </div>
      <input
        type="range"
        min={0}
        max={30000}
        value={duration}
        onChange={e =>
          dispatch(durationChanged(Math.max(1, parseInt(e.target.value))))
        }
      />
      <button
        onClick={() => {
          dispatch(timerReset())
          startTimer()
        }}>
        Reset
      </button>
    </div>
  )
}

export default Timer
