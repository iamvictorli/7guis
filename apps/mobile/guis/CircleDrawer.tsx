import type { GestureResponderEvent } from 'react-native'

import React, { memo, useRef } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Svg, { Circle as SvgCircle } from 'react-native-svg'

import { circleAdded, circleSelected, circleUpdated, deselect, radiusChanged, redo, selectCircleById, selectCircleIds, selectRedoDisabled, selectUI, selectUndoDisabled, undo } from '@victorli/7guis-state/circleDrawerSlice'
import { useAppDispatch, useAppSelector } from '@victorli/7guis-state/hooks'
import { Button } from '@victorli/7guis-ui-mobile/Button'
import { Modal } from '@victorli/7guis-ui-mobile/Modal'
import { Slider } from '@victorli/7guis-ui-mobile/Slider'
import { Text } from '@victorli/7guis-ui-mobile/Text'
import { theme } from '@victorli/7guis-ui-mobile/theme'

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: theme.colors.background, // Canvas background
  },
  canvas: {
    flex: 1, // Take up all available space above buttons
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface, // White drawing area
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background, // Match screen background
  },
  button: {
    flex: 1, // Allow buttons to grow
    marginHorizontal: theme.spacing.s,
  },
  // Styles for modal content if needed (already handled by AppModal mostly)
})

const Circle = memo(({
  id,
  isSelected,
}: {
  id: string
  isSelected: boolean
  selectedCircleRadius: number
}) => {
  const circle = useAppSelector(state => selectCircleById(state, id))
  const dispatch = useAppDispatch()
  if (!circle)
    return null

  return (
    // We handle tap on the outer Pressable now, just render SVG
    <SvgCircle
      key={circle.id}
      cx={circle.x}
      cy={circle.y}
      r={circle.radius}
      fill={`${theme.colors.primary}80`} // Semi-transparent fill
      stroke={isSelected ? theme.colors.secondary : theme.colors.primary}
      strokeWidth={isSelected ? 3 : 1}
      onPress={() => dispatch(circleSelected(circle.id))}
    />
  )
}, (prevProps, nextProps) => {
  // only rerender selected/deselected circle
  if (prevProps.isSelected !== nextProps.isSelected)
    return false
    // changing radius slider only rerenders the selected circle
  if (prevProps.isSelected && nextProps.isSelected && prevProps.selectedCircleRadius !== nextProps.selectedCircleRadius)
    return false
  return true
})

export function CircleDrawer() {
  const dispatch = useAppDispatch()
  const undoDisabled = useAppSelector(selectUndoDisabled)
  const redoDisabled = useAppSelector(selectRedoDisabled)
  const circleIds = useAppSelector(selectCircleIds)
  const { selectedCircleId, selectedCircleRadius } = useAppSelector(selectUI)
  const selectedCircle = useAppSelector(state => selectCircleById(state, selectedCircleId))

  const canvasRef = useRef<View>(null) // Ref for canvas dimensions if needed

  // --- Event Handlers ---
  const handleCanvasTap = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent

    const newCircle = {
      x: locationX,
      y: locationY,
      radius: 20,
    }
    dispatch(circleAdded(newCircle))
  }

  const handleUpdateDiameter = () => {
    if (!selectedCircle)
      return

    dispatch(circleUpdated({
      id: selectedCircle.id,
      x: selectedCircle.x,
      y: selectedCircle.y,
      radius: selectedCircleRadius,
    }))
    dispatch(deselect())
  }

  const handleCloseModal = () => {
    dispatch(deselect())
  }

  return (
    <View style={styles.screenContainer}>
      {/* Canvas Area */}
      {/* Use Pressable for tap detection */}
      <Pressable
        ref={canvasRef}
        style={styles.canvas}
        onPress={handleCanvasTap}
        accessibilityLabel="Drawing Canvas"
      >
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
          {
            circleIds.map(circleId => (
              <Circle key={circleId} id={circleId} isSelected={circleId === selectedCircleId} selectedCircleRadius={selectedCircleRadius} />
            ))
          }
        </Svg>
        {/* Optional: You could render text labels here if needed */}
      </Pressable>

      {/* Control Buttons */}
      <View style={styles.buttonRow}>
        <Button title="Undo" onPress={() => dispatch(undo())} disabled={undoDisabled} style={styles.button} />
        <Button title="Redo" onPress={() => dispatch(redo())} disabled={redoDisabled} style={styles.button} />
      </View>

      {/* Diameter Adjustment Modal */}
      <Modal
        visible={selectedCircleId !== ''}
        onClose={handleCloseModal} // Use specific close handler
        title="Adjust Diameter"
      >
        <View>
          <Text variant="label" style={{ marginBottom: theme.spacing.s }}>
            Diameter:
            {(selectedCircleRadius * 2).toFixed(0)}
            px
          </Text>
          <Slider
            minimumValue={5} // Min diameter
            maximumValue={150}
            step={1}
            value={selectedCircleRadius}
            onValueChange={value => dispatch(radiusChanged(value))}
            showValue={false} // Hide default slider value display
            containerStyle={{ marginBottom: theme.spacing.m }}
          />
          <Button title="Update Diameter" onPress={handleUpdateDiameter} />
        </View>
      </Modal>
    </View>
  )
}
