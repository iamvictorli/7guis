import type { PayloadAction } from '@reduxjs/toolkit'

import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit'

import type { EntityMap } from './types'

export interface Circle {
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

export interface CircleDrawerState {
  circles: EntityMap<Circle>
  // undos and redos is a stack of circles actions, when popped does the CircleAction
  undos: CircleAction[]
  redos: CircleAction[]
  ui: {
    selectedCircleId: string
    selectedCircleRadius: number
  }
}

export const initialState: CircleDrawerState = {
  circles: {
    byId: {},
  },
  undos: [],
  redos: [],
  ui: {
    selectedCircleId: '',
    selectedCircleRadius: 0,
  },
}

/**
 * Circle Drawer slice for managing an interactive circle drawer.
 *
 * Features:
 * - Users can add circles by clicking on the canvas.
 * - Clicking a circle selects it, enabling diameter adjustments.
 * - Supports undo/redo functionality using an action stack.
 */
const circleDrawerSlice = createSlice({
  name: 'circles-drawer',
  initialState,
  reducers: {
    /**
     * Adds a new circle at the specified location.
     * Clears the redo stack to prevent conflicts.
     */
    circleAdded: {
      reducer: (state, action: PayloadAction<Circle>) => {
        const newCircle = action.payload
        // add new circle
        state.circles.byId[newCircle.id] = newCircle

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

    /**
     * Updates a circle's size or position.
     * Previous state is stored for undo functionality.
     */
    circleUpdated: (state, action: PayloadAction<Circle>) => {
      const circle = action.payload
      const { x: newX, y: newY, radius: newRadius } = circle
      const circleToUpdate = state.circles.byId[circle.id]
      // make sure circle exists, and there are changes to the circle
      if (!circleToUpdate)
        return

      if (
        circleToUpdate.radius === newRadius
        && circleToUpdate.x === newX
        && circleToUpdate.y === newY
      ) {
        return
      }

      // when undo happens, go back to the old circle state
      state.undos.push({ type: 'update', ...circleToUpdate })

      // updates circle
      state.circles.byId[circle.id] = circle

      // clear redos
      state.redos = []
    },

    /**
     * Reverts the last action using an undo stack.
     */
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
            if (!circleToUpdate)
              break
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
            if (!circleToDelete)
              break
            state.redos.push({ type: 'add', ...circleToDelete })

            // delete circle
            delete state.circles.byId[circleId]

            break
          }
          default:
            break
        }

        state.ui = initialState.ui
      }
    },

    /**
     * Re-applies the last undone action using a redo stack.
     */
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
            if (!circleToUpdate)
              break
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
            if (!circleToDelete)
              break
            state.undos.push({ type: 'add', ...circleToDelete })

            // delete circle
            delete state.circles.byId[circleId]

            break
          }
          default:
            break
        }

        state.ui = initialState.ui
      }
    },
    circleSelected: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const circle = state.circles.byId[id]
      if (!circle)
        return
      state.ui.selectedCircleId = id
      state.ui.selectedCircleRadius = circle.radius
    },
    deselect: (state) => {
      state.ui = initialState.ui
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
    selectCircles: state => state.circles,
    selectUndoDisabled: state => state.undos.length === 0,
    selectRedoDisabled: state => state.redos.length === 0,
    selectCircleById: (state, id: string) => state.circles.byId[id],
  },
})

export const { name, reducer } = circleDrawerSlice

const { actions, selectors } = circleDrawerSlice
export const {
  circleAdded,
  circleSelected,
  radiusChanged,
  circleUpdated,
  undo,
  redo,
  deselect,
} = actions
export const {
  selectUndoDisabled,
  selectRedoDisabled,
  selectUI,
  selectCircleById,
} = selectors

const { selectCircles } = selectors
export const selectCircleIds = createSelector([selectCircles], (circles) => {
  return Object.keys(circles.byId)
})
