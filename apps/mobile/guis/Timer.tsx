import React, { useCallback, useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'

import { useAppDispatch, useAppSelector } from '@victorli/7guis-state/hooks'
import { durationChanged, nowChanged, selectDuration, selectElapsedMs, timerReset } from '@victorli/7guis-state/timerSlice'
import { Button } from '@victorli/7guis-ui-mobile/Button'
import { Slider } from '@victorli/7guis-ui-mobile/Slider'
import { Text } from '@victorli/7guis-ui-mobile/Text'
import { theme } from '@victorli/7guis-ui-mobile/theme'
import { commonStyles } from '~/styles/commonStyles'

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    padding: theme.spacing.l, // Make children stretch horizontally by default
  },
  label: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  progressBarContainer: {
    backgroundColor: theme.colors.border,
    borderRadius: 5,
    height: 10,
    marginBottom: theme.spacing.s,
    overflow: 'hidden', // Ensure fill stays within bounds
    width: '100%',
  },
  progressBarFill: {
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    height: '100%',
  },
  resetButton: {
    alignSelf: 'center', // Center the button
    marginTop: theme.spacing.m,
    minWidth: 150,
  },
  sliderContainer: {
    marginBottom: 0, // Remove default slider bottom margin
  },
  timeText: {
    fontWeight: 'bold',
    marginBottom: theme.spacing.xl, // More space after elapsed time
    textAlign: 'center',
  },
})

export function Timer() {
  const dispatch = useAppDispatch()
  const duration = useAppSelector(selectDuration)
  const elapsedMs = useAppSelector(selectElapsedMs)

  // Use a ref to store the interval ID so cleanup works reliably
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  /**
   * Starts the timer by setting an interval that updates the current time.
   */
  const startTimer = useCallback(() => {
    if (intervalRef.current)
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
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
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

  // --- Event Handlers ---
  const handleDurationChange = (value: number) => {
    dispatch(durationChanged(value))
  }

  const handleReset = () => {
    dispatch(timerReset())
  }

  const seconds = Math.floor(elapsedMs / 1000)
  const decisecond = Math.trunc((elapsedMs % 1000) / 100)

  const progressPercent = Math.min(100, Math.max(0, (elapsedMs / duration) * 100))

  return (
    <View style={[commonStyles.container, styles.container]}>
      {/* Elapsed Time Display */}
      <Text variant="label" style={styles.label}>Elapsed Time:</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>
      <Text variant="h2" style={styles.timeText}>
        {seconds}
        .
        {decisecond}
        s
      </Text>

      {/* Duration Control */}
      <Text variant="label" style={styles.label}>Duration:</Text>
      <Slider
        minimumValue={0}
        maximumValue={30000}
        step={100} // Step in 100ms increments
        value={duration}
        onValueChange={handleDurationChange}
        containerStyle={styles.sliderContainer}
        showValue={false}
      />

      {/* Reset Button */}
      <Button
        title="Reset Timer"
        onPress={handleReset}
        style={styles.resetButton}
      />
    </View>
  )
}
