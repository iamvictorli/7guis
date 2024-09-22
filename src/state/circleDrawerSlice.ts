import { createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { EntityMap } from './types'

interface Circle {
  id: string
  x: number
  y: number
  radius: number
}

interface CircleAddAction {
  type: 'add'
  id: string
  x: number
  y: number
  radius: number
}

interface CircleDeleteAction {
  type: 'delete'
  id: string
}

interface CircleUpdateAction {
  type: 'update'
  id: string
  x: number
  y: number
  radius: number
}

type CircleAction = CircleAddAction | CircleDeleteAction | CircleUpdateAction

// This implementation uses snapshots of circles with each action
// Ideally implementation should use a stack of actions (command pattern) because it is more memory efficient

interface CircleDrawerState {
  circles: EntityMap<Circle>
  // undos and redos is a stack of circles snapshot
  undos: CircleAction[]
  redos: CircleAction[]
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
        // add new circle
        state.circles.byId[newCircle.id] = newCircle
        state.circles.allIds.push(newCircle.id)

        // when undo happens, delete that circle
        state.undos.push({ type: 'delete', id: newCircle.id })
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
      const circleToUpdate = state.circles.byId[circle.id]
      // make sure circle exists, and there are changes to the circle
      if (!circleToUpdate) return

      if (
        circleToUpdate.radius === newRadius &&
        circleToUpdate.x === newX &&
        circleToUpdate.y === newY
      )
        return

      // when undo happens, go back to the old circle state
      state.undos.push({ type: 'update', ...circleToUpdate })

      // updates circle
      state.circles.byId[circle.id] = circle

      // clear redos
      state.redos = []
    },
    undo: (state) => {
      if (state.undos.length > 0) {
        // pop and do that action
        const circleAction = state.undos.pop()!
        const circleId = circleAction.id

        switch (circleAction.type) {
          case 'add': {
            // add delete to redo
            state.redos.push({ type: 'delete', id: circleId })

            // add new circle
            state.circles.allIds.push(circleId)
            state.circles.byId[circleId] = {
              id: circleId,
              x: circleAction.x,
              y: circleAction.y,
              radius: circleAction.radius,
            }

            break
          }
          case 'update': {
            // add update to redo
            const circleToUpdate = state.circles.byId[circleId]
            state.redos.push({ type: 'update', ...circleToUpdate })

            // update circle
            state.circles.byId[circleId] = {
              id: circleId,
              x: circleAction.x,
              y: circleAction.y,
              radius: circleAction.radius,
            }

            break
          }
          case 'delete': {
            // add to redo
            const circleToDelete = state.circles.byId[circleId]
            state.redos.push({ type: 'add', ...circleToDelete })

            // delete circle
            delete state.circles.byId[circleId]
            const index = state.circles.allIds.findIndex(
              (id) => id === circleId,
            )
            if (index !== -1) state.circles.allIds.splice(index, 1)

            break
          }
          default:
            break
        }

        state.ui.selectedCircleId = ''
      }
    },
    redo: (state) => {
      if (state.redos.length > 0) {
        // pop and do that action
        const circleAction = state.redos.pop()!
        const circleId = circleAction.id

        switch (circleAction.type) {
          case 'add': {
            // add delete to undo
            state.undos.push({ type: 'delete', id: circleId })

            // add new circle
            state.circles.allIds.push(circleId)
            state.circles.byId[circleId] = {
              id: circleId,
              x: circleAction.x,
              y: circleAction.y,
              radius: circleAction.radius,
            }

            break
          }
          case 'update': {
            // add update to undo
            const circleToUpdate = state.circles.byId[circleId]
            state.undos.push({ type: 'update', ...circleToUpdate })

            // update circle
            state.circles.byId[circleId] = {
              id: circleId,
              x: circleAction.x,
              y: circleAction.y,
              radius: circleAction.radius,
            }

            break
          }
          case 'delete': {
            // add to undo
            const circleToDelete = state.circles.byId[circleId]
            state.undos.push({ type: 'add', ...circleToDelete })

            // delete circle
            delete state.circles.byId[circleId]
            const index = state.circles.allIds.findIndex(
              (id) => id === circleId,
            )
            if (index !== -1) state.circles.allIds.splice(index, 1)

            break
          }
          default:
            break
        }

        state.ui.selectedCircleId = ''
      }
    },
    circleSelected: (state, action: PayloadAction<string>) => {
      const id = action.payload
      state.ui.selectedCircleId = id
      state.ui.selectedCircleRadius = state.circles.byId[id].radius
    },
    deselect: (state) => {
      state.ui.selectedCircleId = ''
      state.ui.selectedCircleRadius = 0
    },
    radiusChanged: (state, action: PayloadAction<number>) => {
      const newRadius = action.payload
      if (state.ui.selectedCircleId !== '') {
        state.ui.selectedCircleRadius = newRadius
      }
    },
  },
  selectors: {
    selectUI: (state) => state.ui,
    selectCirclesIds: (state) => state.circles.allIds,
    selectUndoDisabled: (state) => state.undos.length === 0,
    selectRedoDisabled: (state) => state.redos.length === 0,
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
  deselect,
} = circleDrawerSlice.actions

export const CIRCLE_DRAWER_REDUCER_NAME = circleDrawerSlice.name
export default circleDrawerSlice.reducer
