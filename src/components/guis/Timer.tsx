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

// TODO: middleware? listener middleware?
// set into redux middleware b/c of interval side effects
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
    <Flex direction="column" gap="4">
      <Text>
        {seconds}.{decisecond}s
      </Text>

      <Progress max={duration} value={elapsedMs} />
      <Slider
        min={0}
        max={30000}
        value={[duration]}
        onValueChange={(value) => {
          dispatch(durationChanged(value[0]))
        }}
      />
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
