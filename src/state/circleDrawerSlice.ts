import { createSlice, nanoid, current } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { EntityMap } from './types'

interface Circle {
  id: string
  x: number
  y: number
  radius: number
}

// This implementation uses snapshots of circles with each action
// Ideally implementation should use a stack of actions (command pattern) because it is more memory efficient

interface CircleDrawerState {
  circles: EntityMap<Circle>
  // undos and redos is a stack of circles snapshot
  undos: EntityMap<Circle>[]
  redos: EntityMap<Circle>[]
  ui: {
    selectedCircleId: string
    selectedCircleRadius: number
  }
}

const initialState: CircleDrawerState = {
  circles: {
    byId: {},
    allIds: [],
  },
  undos: [],
  redos: [],
  ui: {
    selectedCircleId: '',
    selectedCircleRadius: 0,
  },
} satisfies CircleDrawerState as CircleDrawerState

const circleDrawerSlice = createSlice({
  name: 'circles-drawer',
  initialState,
  reducers: {
    circleAdded: {
      reducer: (state, action: PayloadAction<Circle>) => {
        const newCircle = action.payload
        // push current snapshot to undo
        const currentCirclesSnapshot = current(state.circles)
        state.undos.push(currentCirclesSnapshot)

        // new circles snapshot
        state.circles.byId[newCircle.id] = newCircle
        state.circles.allIds.push(newCircle.id)

        // clear redos
        state.redos = []
        state.ui.selectedCircleId = ''
      },
      prepare: (circleProps: Omit<Circle, 'id'>) => {
        return {
          payload: {
            id: nanoid(),
            ...circleProps,
          },
        }
      },
    },
    circleUpdated: (state, action: PayloadAction<Circle>) => {
      const circle = action.payload
      const { x: newX, y: newY, radius: newRadius } = circle
      if (!state.circles.byId[circle.id]) return

      if (
        state.circles.byId[circle.id].radius === newRadius &&
        state.circles.byId[circle.id].x === newX &&
        state.circles.byId[circle.id].y === newY
      )
        return

      // push current snapshot to undo
      const currentCirclesSnapshot = current(state.circles)
      state.undos.push(currentCirclesSnapshot)

      // updates circle
      state.circles.byId[circle.id] = circle

      // clear redos
      state.redos = []
    },
    undo: state => {
      if (state.undos.length > 0) {
        // push current snapshot to redo
        const currentCirclesSnapshot = current(state.circles)
        state.redos.push(currentCirclesSnapshot)

        // revert to previous circle snapshot from undo
        const previousCirclesSnapshot = state.undos.pop()
        state.circles = previousCirclesSnapshot!

        state.ui.selectedCircleId = ''
      }
    },
    redo: state => {
      if (state.redos.length > 0) {
        // push current snapshot to undo
        const currentCirclesSnapshot = current(state.circles)
        state.undos.push(currentCirclesSnapshot)

        // pop from redo snapshot
        const previousCirclesSnapshot = state.redos.pop()
        state.circles = previousCirclesSnapshot!

        state.ui.selectedCircleId = ''
      }
    },
    circleSelected: (state, action: PayloadAction<string>) => {
      const id = action.payload
      state.ui.selectedCircleId = id
      state.ui.selectedCircleRadius = state.circles.byId[id].radius
    },
    radiusChanged: (state, action: PayloadAction<number>) => {
      const newRadius = action.payload
      if (state.ui.selectedCircleId !== '') {
        state.ui.selectedCircleRadius = newRadius
      }
    },
  },
  selectors: {
    selectUI: state => state.ui,
    selectCirclesIds: state => state.circles.allIds,
    selectUndoDisabled: state => state.undos.length === 0,
    selectRedoDisabled: state => state.redos.length === 0,
    selectCircleById: (state, id: string) => state.circles.byId[id],
  },
})

export const {
  selectUndoDisabled,
  selectRedoDisabled,
  selectUI,
  selectCircleById,
  selectCirclesIds,
} = circleDrawerSlice.selectors

export const {
  circleAdded,
  circleSelected,
  radiusChanged,
  circleUpdated,
  undo,
  redo,
} = circleDrawerSlice.actions

export const CIRCLE_DRAWER_REDUCER_NAME = circleDrawerSlice.name
export default circleDrawerSlice.reducer
