import { Label } from '@radix-ui/react-label'
import { Button, Flex, Progress, Text } from '@radix-ui/themes'
import { useCallback, useEffect, useRef } from 'react'

import { useAppDispatch, useAppSelector } from '@victorli/7guis-state/hooks'
import {
  durationChanged,
  nowChanged,
  selectDuration,
  selectElapsedMs,
  timerReset,
} from '@victorli/7guis-state/timerSlice'
import Slider from '~/components/Slider'

/**
 * A timer that displays elapsed time with a progress bar.
 * It allows the user to adjust the duration and reset the timer.
 */
export default function Timer() {
  const intervalRef = useRef<ReturnType<typeof setInterval>>()
  const dispatch = useAppDispatch()
  const duration = useAppSelector(selectDuration)
  const elapsedMs = useAppSelector(selectElapsedMs)

  /**
   * Starts the timer by setting an interval that updates the current time.
   */
  const startTimer = useCallback(() => {
    stopTimer()
    dispatch(nowChanged(new Date().getTime()))
    intervalRef.current = setInterval(() => {
      dispatch(nowChanged(new Date().getTime()))
    }, 100)
  }, [dispatch])

  /**
   * Stops the timer by clearing the interval.
   */
  function stopTimer() {
    clearInterval(intervalRef.current)
  }

  // Initialize the timer on mount and reset on unmount.
  useEffect(() => {
    dispatch(timerReset())
    startTimer()
    return () => {
      stopTimer()
    }
  }, [dispatch, startTimer])

  // Automatically stop the timer after one minute.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      stopTimer()
    }, 60 * 1000)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  const seconds = Math.floor(elapsedMs / 1000)
  const decisecond = Math.trunc((elapsedMs % 1000) / 100)

  return (
    <Flex direction="column" gap="4" maxWidth="350px">
      <Flex direction="row" gap="4" align="center">
        <Label htmlFor="elapsed-time">Elapsed Time:</Label>
        <Progress
          id="elapsed-time"
          max={duration}
          value={elapsedMs}
          size="3"
          aria-label="Elapsed Time"
        />
      </Flex>

      <Text size="7">
        {seconds}
        .
        {decisecond}
        s
      </Text>

      <Flex direction="row" gap="4" align="center">
        <Label htmlFor="duration">Duration:</Label>
        <Slider
          id="duration"
          min={0}
          max={30000}
          value={[duration]}
          onValueChange={(value) => {
            if (value[0]) {
              dispatch(durationChanged(value[0]))
            }
          }}
          thumbLabel="Duration"
        />
      </Flex>

      <Button
        variant="outline"
        onClick={() => {
          dispatch(timerReset())
          startTimer()
        }}
      >
        Reset
      </Button>
    </Flex>
  )
}
