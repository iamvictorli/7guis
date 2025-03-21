import { describe, expect, it } from 'vitest'

import type { Circle } from './circleDrawerSlice'

import { circleAdded, circleSelected, circleUpdated, deselect, initialState, name, radiusChanged, redo, reducer, selectCircleById, selectCircleIds, selectRedoDisabled, selectUI, selectUndoDisabled, undo } from './circleDrawerSlice'

describe('circleDrawerSlice', () => {
  describe('circleAdded', () => {
    it('should add a new circle and update undo/redo and ui state', () => {
      // Dispatch the action. Note: circleAdded uses a prepare callback that generates a random id.
      const circleAddedAction = circleAdded({ x: 100, y: 150, radius: 30 })
      const state = reducer(initialState, circleAddedAction)

      expect(selectCircleById({ [name]: state }, circleAddedAction.payload.id)).toEqual(circleAddedAction.payload)

      // Check that the undo stack has a delete action.
      expect(state.undos).toEqual([{ type: 'delete', id: circleAddedAction.payload.id }])
      expect(state.redos).toHaveLength(0)
      expect(selectUndoDisabled({ [name]: state })).toBe(false)
      expect(selectRedoDisabled({ [name]: state })).toBe(true)
      expect(selectUI({ [name]: state })).toEqual(initialState.ui)
    })
  })

  describe('circleUpdated', () => {
    it('should update an existing circle and push previous state into undos', () => {
      let state = initialState

      const circleAddedAction = circleAdded({ x: 50, y: 50, radius: 10 })
      const circleId = circleAddedAction.payload.id
      state = reducer(state, circleAddedAction)

      // Dispatch an update action with new properties.
      const updatedCircle: Circle = { id: circleId, x: 60, y: 60, radius: 15 }
      state = reducer(state, circleUpdated(updatedCircle))

      // Verify the circle is updated.
      expect(selectCircleById({ [name]: state }, circleId)).toEqual(updatedCircle)

      // Check that the undo stack has the previous circle state.
      expect(state.undos).toEqual([{ type: 'delete', id: circleId }, { type: 'update', id: circleId, x: 50, y: 50, radius: 10 }])
      expect(state.redos).toHaveLength(0)
      expect(selectUndoDisabled({ [name]: state })).toBe(false)
      expect(selectRedoDisabled({ [name]: state })).toBe(true)
      expect(selectUI({ [name]: state })).toEqual(initialState.ui)
    })

    it('should do nothing if updating a non-existent circle', () => {
      // Attempt to update a circle that does not exist.
      const circleAddedAction = circleAdded({ x: 100, y: 100, radius: 20 })
      // hasnt been added
      const nonExistentCircle = circleAddedAction.payload
      const newState = reducer(initialState, circleUpdated(nonExistentCircle))
      // The state should remain unchanged.
      expect(newState).toEqual(initialState)
    })

    it('should not record an update if no changes are made', () => {
      let state = initialState
      // Pre-add a circle.
      const circleAddedAction = circleAdded({ x: 30, y: 30, radius: 5 })
      const circle = circleAddedAction.payload
      state = reducer(state, circleAddedAction)
      // Dispatch an update with the same values.
      const sameCircle = { ...circle }
      const newState = reducer(state, circleUpdated(sameCircle))
      // No changes: undo stack should not be appended.
      expect(selectCircleById({ [name]: state }, circle.id)).toEqual(circle)
      expect(newState.undos).toHaveLength(1)
      expect(newState.redos).toHaveLength(0)
      expect(selectUndoDisabled({ [name]: state })).toBe(false)
      expect(selectRedoDisabled({ [name]: state })).toBe(true)
      expect(selectUI({ [name]: state })).toEqual(initialState.ui)
    })
  })

  describe('undo', () => {
    it('should undo an add (removing the circle and adding a redo action)', () => {
      let state = initialState
      // First add a circle.
      const circleAddedAction = circleAdded({ x: 200, y: 200, radius: 25 })
      state = reducer(state, circleAddedAction)
      const circleId = circleAddedAction.payload.id
      // select circle
      state = reducer(state, circleSelected(circleId))

      expect(selectCircleById({ [name]: state }, circleId)).toEqual({ id: circleId, x: 200, y: 200, radius: 25 })
      expect(state.undos).toEqual([{ type: 'delete', id: circleId }])
      expect(state.undos).toHaveLength(1)
      expect(state.redos).toHaveLength(0)
      expect(selectUndoDisabled({ [name]: state })).toBe(false)
      expect(selectRedoDisabled({ [name]: state })).toBe(true)
      expect(selectUI({ [name]: state })).toEqual({ selectedCircleId: circleId, selectedCircleRadius: 25 })

      // Call undo to remove the added circle.
      state = reducer(state, undo())
      expect(selectCircleById({ [name]: state }, circleId)).toBeUndefined()
      expect(state.undos).toHaveLength(0)
      expect(state.redos).toHaveLength(1)
      expect(selectUndoDisabled({ [name]: state })).toBe(true)
      expect(selectRedoDisabled({ [name]: state })).toBe(false)
      // Redo stack should have an add action.
      expect(state.redos).toEqual([{ type: 'add', id: circleId, x: 200, y: 200, radius: 25 }])
      // UI selection should be cleared.
      expect(selectUI({ [name]: state })).toEqual(initialState.ui)
    })

    it('should undo an update (reverting to previous state)', () => {
      let state = initialState
      // Pre-add and then update a circle.
      const circleAddedAction = circleAdded({ x: 40, y: 40, radius: 8 })
      const circle = circleAddedAction.payload
      state = reducer(state, circleAddedAction)

      const updated = { ...circle, x: 45, y: 45, radius: 10 }
      state = reducer(state, circleUpdated(updated))
      // Perform undo – this should revert the update.
      state = reducer(state, undo())
      expect(selectCircleById({ [name]: state }, circle.id)).toEqual(circle)
      // Redo stack should contain an update action.
      expect(state.redos).toContainEqual({ type: 'update', ...updated })
    })

    it('should not change state if undo stack is empty', () => {
      let state = initialState
      const prevState = state
      state = reducer(state, undo())
      expect(state).toEqual(prevState)
    })
  })

  describe('redo', () => {
    it('should redo an add (re-adding the circle and pushing to undo)', () => {
      let state = initialState
      // Add and then undo a circle.
      const circleAddedAction = circleAdded({ x: 300, y: 300, radius: 35 })
      state = reducer(state, circleAddedAction)
      const circleId = circleAddedAction.payload.id
      state = reducer(state, undo())
      expect(state.circles.byId[circleId]).toBeUndefined()
      // Redo the add.
      state = reducer(state, redo())
      expect(selectCircleById({ [name]: state }, circleId)).toEqual({ id: circleId, x: 300, y: 300, radius: 35 })
      // Undo stack should contain the delete action.
      expect(state.undos).toEqual([{ type: 'delete', id: circleId }])
    })

    it('should not change state if redo stack is empty', () => {
      const state = reducer(initialState, redo())
      expect(state).toEqual(initialState)
    })
  })

  describe('circleSelected', () => {
    it('should update UI with the selected circle', () => {
      const circleAddedAction = circleAdded({ x: 10, y: 10, radius: 12 })
      const circle = circleAddedAction.payload
      let state = reducer(initialState, circleAddedAction)
      state = reducer(state, circleSelected(circle.id))
      expect(selectUI({ [name]: state })).toEqual({ selectedCircleId: circle.id, selectedCircleRadius: circle.radius })
    })

    it('should do nothing if selecting a non-existent circle', () => {
      const state = reducer(initialState, circleSelected('non-existent'))
      expect(state).toEqual(initialState)
    })
  })

  describe('deselect', () => {
    it('should clear the UI selection', () => {
      const circleAddedAction = circleAdded({ x: 10, y: 10, radius: 12 })
      const circle = circleAddedAction.payload
      let state = reducer(initialState, circleAddedAction)
      // select
      state = reducer(state, circleSelected(circle.id))
      expect(selectUI({ [name]: state })).toEqual({ selectedCircleId: circle.id, selectedCircleRadius: circle.radius })

      // deselect
      state = reducer(state, deselect())
      expect(selectUI({ [name]: state })).toEqual(initialState.ui)
    })
  })

  describe('radiusChanged', () => {
    it('should update the selected circle radius in the UI when a circle is selected', () => {
      const circleAddedAction = circleAdded({ x: 10, y: 10, radius: 12 })
      const circle = circleAddedAction.payload
      let state = reducer(initialState, circleAddedAction)
      // select circle
      state = reducer(state, circleSelected(circle.id))
      expect(selectUI({ [name]: state })).toEqual({ selectedCircleId: circle.id, selectedCircleRadius: circle.radius })

      state = reducer(state, radiusChanged(20))
      expect(selectUI({ [name]: state })).toEqual({ selectedCircleId: circle.id, selectedCircleRadius: 20 })
    })

    it('should not update radius if no circle is selected', () => {
      const circleAddedAction = circleAdded({ x: 10, y: 10, radius: 12 })
      let state = reducer(initialState, circleAddedAction)
      expect(selectUI({ [name]: state })).toEqual(initialState.ui)

      state = reducer(state, radiusChanged(30))
      expect(selectUI({ [name]: state })).toBe(initialState.ui)
    })
  })

  describe('selectors', () => {
    let state = initialState
    const circleAddedAction1 = circleAdded({ x: 5, y: 5, radius: 10 })
    const circleAddedAction2 = circleAdded({ x: 10, y: 10, radius: 20 })
    const circle1 = circleAddedAction1.payload
    const circle2 = circleAddedAction2.payload
    state = reducer(state, circleAddedAction1)
    state = reducer(state, circleAddedAction2)

    it('selectUI returns the UI state', () => {
      expect(selectUI({ [name]: state })).toEqual(initialState.ui)
    })

    it('selectUndoDisabled returns false', () => {
      expect(selectUndoDisabled({ [name]: state })).toBe(false)
    })

    it('selectRedoDisabled returns true', () => {
      expect(selectRedoDisabled({ [name]: state })).toBe(true)
    })

    it('selectCircleById returns the correct circle', () => {
      expect(selectCircleById({ [name]: state }, circle1.id)).toEqual(circle1)
      expect(selectCircleById({ [name]: state }, circle2.id)).toEqual(circle2)
      const circleNonExistent = selectCircleById({ [name]: state }, 'non-existent')
      expect(circleNonExistent).toBeUndefined()
    })

    it('selectCircleIds returns an array of circle IDs', () => {
      expect(selectCircleIds({ [name]: state })).toEqual([circle1.id, circle2.id])
    })
  })
})
