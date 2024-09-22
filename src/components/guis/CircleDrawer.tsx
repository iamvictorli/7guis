import { Box, Button, Flex, Popover, Slider } from '@radix-ui/themes'
import { useAppDispatch, useAppSelector } from '~/store'

import {
  circleAdded,
  circleSelected,
  circleUpdated,
  deselect,
  radiusChanged,
  redo,
  selectCircleById,
  selectCirclesIds,
  selectRedoDisabled,
  selectUI,
  selectUndoDisabled,
  undo,
} from 'state/circleDrawerSlice'

function Circle({ id }: { id: string }) {
  const circle = useAppSelector((state) => selectCircleById(state, id))
  const { selectedCircleId, selectedCircleRadius } = useAppSelector(selectUI)
  const isSelected = selectedCircleId === id
  const dispatch = useAppDispatch()
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
        onClick={(event) => event.stopPropagation()}
        onEscapeKeyDown={() => {
          dispatch(deselect())
        }}
        onPointerDownOutside={() => {
          dispatch(deselect())
        }}>
        <Box>
          <Slider
            value={[selectedCircleRadius]}
            min={10}
            max={80}
            onValueChange={([value]) => {
              dispatch(radiusChanged(value))
            }}
            onValueCommit={([value]) => {
              dispatch(
                circleUpdated({
                  id: circle.id,
                  x: circle.x,
                  y: circle.y,
                  radius: value,
                }),
              )
            }}
          />
        </Box>
      </Popover.Content>
    </Popover.Root>
  )
}

export default function CircleDrawer() {
  const dispatch = useAppDispatch()

  const undoDisabled = useAppSelector(selectUndoDisabled)
  const redoDisabled = useAppSelector(selectRedoDisabled)
  const circleIds = useAppSelector(selectCirclesIds)

  return (
    <>
      <Flex gap="3" justify="center">
        <Button
          onClick={() => {
            dispatch(undo())
          }}
          disabled={undoDisabled}>
          Undo
        </Button>
        <Button
          onClick={() => {
            dispatch(redo())
          }}
          disabled={redoDisabled}>
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
        }}>
        {circleIds.map((circleId) => (
          <Circle key={circleId} id={circleId} />
        ))}
      </svg>
    </>
  )
}
