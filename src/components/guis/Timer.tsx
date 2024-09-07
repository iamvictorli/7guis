import { Box, Button, Progress, Slider, Text } from '@radix-ui/themes'
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

export default function Timer() {
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
      <Box width={{ sm: '350px' }}>
        <Progress max={duration} value={elapsedMs} size="3" />
      </Box>

      <Box height="16px" />

      <Text size="7">
        {seconds}.{decisecond}s
      </Text>

      <Box height="16px" />

      <Box width={{ sm: '350px' }}>
        <Slider
          min={0}
          max={30000}
          value={[duration]}
          onValueChange={(value) => {
            dispatch(durationChanged(value[0]))
          }}
          size="2"
        />
      </Box>

      <Box height="16px" />

      <Button
        variant="outline"
        onClick={() => {
          dispatch(timerReset())
          startTimer()
        }}>
        Reset
      </Button>
    </>
  )
}
