import { useAppDispatch, useAppSelector } from '~/store'

import {
  circleAdded,
  circleSelected,
  circleUpdated,
  radiusChanged,
  redo,
  selectCircleById,
  selectCirclesIds,
  selectRedoDisabled,
  selectUI,
  selectUndoDisabled,
  undo,
} from 'state/circleDrawerSlice'

function Circle({
  id,
  isSelected,
  selectedRadius,
}: {
  id: string
  isSelected: boolean
  selectedRadius: number
}) {
  const circle = useAppSelector((state) => selectCircleById(state, id))
  const dispatch = useAppDispatch()
  return (
    <circle
      cx={circle.x}
      cy={circle.y}
      r={isSelected ? selectedRadius : circle.radius}
      stroke="black"
      fill={isSelected ? '#e5e7eb' : 'transparent'}
      className="hover:fill-gray-200"
      onClick={(event) => {
        event.stopPropagation()
        // popup adjustment
        dispatch(circleSelected(circle.id))
      }}
    />
  )
}

function CircleDrawer() {
  const dispatch = useAppDispatch()
  const { selectedCircleId, selectedCircleRadius } = useAppSelector(selectUI)
  const undoDisabled = useAppSelector(selectUndoDisabled)
  const redoDisabled = useAppSelector(selectRedoDisabled)
  const circleIds = useAppSelector(selectCirclesIds)
  const currentCircle = useAppSelector((state) =>
    selectCircleById(state, selectedCircleId),
  )

  return (
    <>
      <div>
        <button
          onClick={() => {
            dispatch(undo())
          }}
          disabled={undoDisabled}>
          Undo
        </button>
        <button
          onClick={() => {
            dispatch(redo())
          }}
          disabled={redoDisabled}>
          Redo
        </button>
      </div>
      <div>
        <svg
          className="w-96 h-60 border border-black border-solid"
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
            <Circle
              key={circleId}
              id={circleId}
              isSelected={selectedCircleId === circleId}
              selectedRadius={selectedCircleRadius}
            />
          ))}
        </svg>
      </div>
      {currentCircle && (
        <div>
          <input
            className="w-52"
            type="range"
            min="10"
            value={selectedCircleRadius}
            max="80"
            onChange={(event) => {
              dispatch(radiusChanged(Number(event.currentTarget.value)))
            }}
            onMouseUp={(event) => {
              dispatch(
                circleUpdated({
                  id: currentCircle.id,
                  x: currentCircle.x,
                  y: currentCircle.y,
                  radius: Number(event.currentTarget.value),
                }),
              )
            }}
            onTouchEnd={(event) => {
              dispatch(
                circleUpdated({
                  id: currentCircle.id,
                  x: currentCircle.x,
                  y: currentCircle.y,
                  radius: Number(event.currentTarget.value),
                }),
              )
            }}
            onKeyUp={(event) => {
              dispatch(
                circleUpdated({
                  id: currentCircle.id,
                  x: currentCircle.x,
                  y: currentCircle.y,
                  radius: Number(event.currentTarget.value),
                }),
              )
            }}
          />
        </div>
      )}
    </>
  )
}

export default CircleDrawer
