import React, { useCallback, useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'

import { useAppDispatch, useAppSelector } from '@7guis/state/hooks'
import { durationChanged, nowChanged, selectDuration, selectElapsedMs, timerReset } from '@7guis/state/timerSlice'
import { Button } from '~/components/Button/Button'
import { Slider } from '~/components/Slider/Slider'
import { Text } from '~/components/Text/Text'
import { commonStyles } from '~/styles/commonStyles'
import theme from '~/styles/theme'

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.l,
    alignItems: 'stretch', // Make children stretch horizontally by default
  },
  label: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.textSecondary,
  },
  progressBarContainer: {
    height: 10,
    width: '100%',
    backgroundColor: theme.colors.border,
    borderRadius: 5,
    overflow: 'hidden', // Ensure fill stays within bounds
    marginBottom: theme.spacing.s,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
  },
  timeText: {
    marginBottom: theme.spacing.xl, // More space after elapsed time
    textAlign: 'center',
    fontWeight: 'bold',
  },
  durationDisplay: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.l, // Space before reset button
    marginTop: theme.spacing.xs, // Space after slider
  },
  sliderContainer: {
    marginBottom: 0, // Remove default slider bottom margin
  },
  resetButton: {
    marginTop: theme.spacing.m,
    alignSelf: 'center', // Center the button
    minWidth: 150,
  },
})

// Helper to format milliseconds to seconds string (e.g., "12.3s")
function formatTime(ms: number): string {
  return `${(ms / 1000).toFixed(1)}s`
}

export function Timer() {
  const dispatch = useAppDispatch()
  const duration = useAppSelector(selectDuration)
  const elapsedMs = useAppSelector(selectElapsedMs)

  // Use a ref to store the interval ID so cleanup works reliably
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

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
        showValue={false} // We show formatted duration below
      />
      <Text variant="body" style={styles.durationDisplay}>
        {formatTime(duration)}
      </Text>

      {/* Reset Button */}
      <Button
        title="Reset Timer"
        onPress={handleReset}
        style={styles.resetButton}
      />
    </View>
  )
}
