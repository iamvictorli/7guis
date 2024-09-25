import { Label } from '@radix-ui/react-label'
import { Button, Flex, Progress, Slider, Text } from '@radix-ui/themes'
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
    <Flex direction="column" gap="4" maxWidth="350px">
      <Flex direction="row" gap="4" align="center">
        <Label htmlFor="elapsed-time">Elapsed Time:</Label>
        <Progress
          id="elapsed-time"
          max={duration}
          value={elapsedMs}
          size="3"
          aria-label="Elapased Time"
        />
      </Flex>

      <Text size="7">
        {seconds}.{decisecond}s
      </Text>

      <Flex direction="row" gap="4" align="center">
        <Label htmlFor="duration">Duration:</Label>
        <Slider
          id="duration"
          min={0}
          max={30000}
          value={[duration]}
          onValueChange={(value) => {
            dispatch(durationChanged(value[0]))
          }}
          size="2"
          aria-label="Duration"
        />
      </Flex>

      <Button
        variant="outline"
        onClick={() => {
          dispatch(timerReset())
          startTimer()
        }}>
        Reset
      </Button>
    </Flex>
  )
}
