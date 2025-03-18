import { Box, Button, Flex, Popover } from '@radix-ui/themes'
import { memo } from 'react'

import {
  circleAdded,
  circleSelected,
  circleUpdated,
  deselect,
  radiusChanged,
  redo,
  selectCircleById,
  selectCircleIds,
  selectRedoDisabled,
  selectUI,
  selectUndoDisabled,
  undo,
} from '@7gui/state/circleDrawerSlice'
import Slider from '~/components/Slider'
import { useAppDispatch, useAppSelector } from '~/store'

/**
 * Circle Component renders an SVG circle with interactive popover controls to adjust its radius.
 * The circle appearance changes when selected.
 */
const Circle = memo(
  ({
    id,
    isSelected,
    selectedCircleRadius,
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
      <Popover.Root>
        <Popover.Trigger>
          <circle
            cx={circle.x}
            cy={circle.y}
            r={isSelected ? selectedCircleRadius : circle.radius}
            stroke="var(--gray-a11)"
            fill={isSelected ? 'var(--gray-a5)' : 'var(--color-transparent)'}
            className="hover:fill-[var(--gray-a4)]"
            onClick={(event) => {
              event.stopPropagation()
              dispatch(circleSelected(circle.id))
            }}
          />
        </Popover.Trigger>

        <Popover.Content
          size="1"
          width="250px"
          side="right"
          align="end"
          onClick={event => event.stopPropagation()}
          onEscapeKeyDown={() => dispatch(deselect())}
          onPointerDownOutside={() => dispatch(deselect())}
        >
          <Slider
            value={[selectedCircleRadius]}
            min={10}
            max={80}
            onValueChange={([value]) => {
              if (value)
                dispatch(radiusChanged(value))
            }}
            onValueCommit={([value]) => {
              if (value) {
                dispatch(
                  circleUpdated({
                    id: circle.id,
                    x: circle.x,
                    y: circle.y,
                    radius: value,
                  }),
                )
              }
            }}
            thumbLabel="Circle Diameter Slider"
          />
        </Popover.Content>
      </Popover.Root>
    )
  },
  (prevProps, nextProps) => {
    // only rerender selected/deselected circle
    if (prevProps.isSelected !== nextProps.isSelected)
      return false
    // changing radius slider only rerenders the selected circle
    if (prevProps.isSelected && nextProps.isSelected && prevProps.selectedCircleRadius !== nextProps.selectedCircleRadius)
      return false
    return true
  },
)

/**
 * CircleDrawer Component handles drawing circles on an SVG canvas. Supports interactive creation, selection,
 * undo, and redo functionalities.
 */
export default function CircleDrawer() {
  const dispatch = useAppDispatch()
  const undoDisabled = useAppSelector(selectUndoDisabled)
  const redoDisabled = useAppSelector(selectRedoDisabled)
  const circleIds = useAppSelector(selectCircleIds)
  const { selectedCircleId, selectedCircleRadius } = useAppSelector(selectUI)

  return (
    <>
      <Flex gap="3" justify="center">
        <Button onClick={() => dispatch(undo())} disabled={undoDisabled}>
          Undo
        </Button>
        <Button onClick={() => dispatch(redo())} disabled={redoDisabled}>
          Redo
        </Button>
      </Flex>

      <Box height="16px" />

      <svg
        className="h-60 w-full rounded-[var(--radius-4)] border border-solid border-[var(--gray-a9)]"
        // Using data-testid. https://github.com/testing-library/dom-testing-library/issues/1295
        data-testid="Circle Drawer"
        onClick={(event) => {
          const { x, y } = event.currentTarget.getBoundingClientRect()
          const circle = {
            x: event.clientX - x,
            y: event.clientY - y,
            radius: 20,
          }
          dispatch(circleAdded(circle))
        }}
      >
        {circleIds.map(circleId => (
          <Circle
            key={circleId}
            id={circleId}
            isSelected={circleId === selectedCircleId}
            selectedCircleRadius={selectedCircleRadius}
          />
        ))}
      </svg>
    </>
  )
}
