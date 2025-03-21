import { describe, expect, it } from 'vitest'

import { cellChanged, initialState, name, reducer, ROW_COUNT, selectCellMatrix, selectColumnLabels } from './cellsSlice'

describe('cellsSlice', () => {
  describe('initial state', () => {
    it('should be the correct column labels and cell label matrix', () => {
      const state = initialState

      // For a 10x10 grid, the first row should have columns A through J
      expect(selectColumnLabels({ [name]: state })).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'])

      const cellMatrix = selectCellMatrix({ [name]: state })
      // Verify that the cell label matrix has ROW_COUNT entries
      expect(cellMatrix).toHaveLength(ROW_COUNT)

      // Check that each cell id is properly formatted (e.g., A1, B1, etc.)
      const firstRow = cellMatrix[0]!

      expect(firstRow.A?.id).toBe('A1')
      expect(firstRow.B?.id).toBe('B1')
    })
  })

  describe('cellChanged reducer', () => {
    it('should update a cell with a static value (non-formula)', () => {
      const state = reducer(initialState, cellChanged({ id: 'A1', value: '123' }))

      const cell = state.cells.byId.A1
      expect(cell?.formula).toBeNull()
      expect(cell?.computedValue).toBe('123')
    })

    it('should not update the cell if the value is unchanged', () => {
      const cellId = 'A2'
      // First update the cell with a static value
      const state = reducer(initialState, cellChanged({ id: cellId, value: '123' }))
      // Try updating with the same value
      const unchangedState = reducer(state, cellChanged({ id: cellId, value: '123' }))
      expect(unchangedState).toEqual(state)
    })

    it('should update a cell with a valid formula and evaluate it', () => {
      const cellId = 'B1'
      // Use a simple formula that evaluates to a number
      const newState = reducer(initialState, cellChanged({ id: 'B1', value: '=1+2' }))
      const cell = newState.cells.byId[cellId]
      // Initially, computedValue is set to empty before evaluation propagates
      // After evaluation, the recursive calcCell should update computedValue to "3"
      expect(cell?.formula).toBe('=1+2')
      expect(cell?.computedValue).toBe('3')
    })

    it('should update dependencies for formula cells', () => {
      // Set a static value in cell C1, then use it in a formula in cell C2
      const parentId = 'C1'
      const childId = 'C2'
      let state = reducer(initialState, cellChanged({ id: parentId, value: '5' }))
      // Update C2 with a formula referencing C1 (e.g. =C1+10)
      state = reducer(state, cellChanged({ id: childId, value: '=C1+10' }))
      // Check that the parent cell C1 has child C2 in its dependencies (children)
      expect(state.cells.byId[parentId]?.children[childId]).toBe(childId)
      // Also, C2's computed value should be evaluated to "15"
      expect(state.cells.byId[childId]?.computedValue).toBe('15')
    })

    it('should remove old dependencies when a cell is updated from a formula to a static value', () => {
      const cellId = 'D1'

      // First, update D1 with a formula that references E1
      let state = reducer(initialState, cellChanged({ id: cellId, value: '=E1+2' }))
      // Ensure dependency was added: cell E1 should include D1 as a child
      expect(state.cells.byId.E1?.children[cellId]).toBe(cellId)
      // computed value should be 2
      expect(state.cells.byId[cellId]?.formula).toBe('=E1+2')
      expect(state.cells.byId[cellId]?.computedValue).toBe('2')

      // Now update D1 with a static value
      state = reducer(state, cellChanged({ id: cellId, value: '20' }))
      // The dependency from E1 should have been removed
      expect(state.cells.byId.E1?.children[cellId]).toBeUndefined()
      expect(state.cells.byId[cellId]?.formula).toBeNull()
      expect(state.cells.byId[cellId]?.computedValue).toBe('20')
    })

    it('should detect cyclic dependencies and set computedValue to "ERROR"', () => {
      // Create a cycle: F1 depends on F2, and then F2 depends on F1
      const cellF1 = 'F1'
      const cellF2 = 'F2'
      // Set F1 to a formula referencing F2
      let state = reducer(initialState, cellChanged({ id: cellF1, value: '=F2+1' }))
      expect(state.cells.byId[cellF1]?.formula).toBe('=F2+1')
      expect(state.cells.byId[cellF1]?.computedValue).toBe('1')
      // Set F2 to a formula referencing F1, which creates a cycle
      state = reducer(state, cellChanged({ id: cellF2, value: '=F1+1' }))
      // The cycle should be detected.
      // should force both cells to be set to "ERROR"
      expect(state.cells.byId[cellF1]?.computedValue).toBe('ERROR')
      expect(state.cells.byId[cellF2]?.computedValue).toBe('ERROR')
    })

    it('should set computedValue to "ERROR" for an invalid formula', () => {
      const cellId = 'G1'
      // Provide a formula that is syntactically invalid (e.g., missing operand)
      const state = reducer(initialState, cellChanged({ id: cellId, value: '=1+' }))
      const cell = state.cells.byId[cellId]
      expect(cell?.computedValue).toBe('ERROR')
    })

    it('should do nothing if cell does not exist', () => {
      const nonExistentId = 'Z99'
      const state = reducer(initialState, cellChanged({ id: nonExistentId, value: '1' }))
      // Expect state to be unchanged if cell ID not found
      expect(state).toEqual(initialState)
    })
  })

  describe('selectors', () => {
    it('selectCellMatrix should return a matrix mapping column labels to cell objects', () => {
      const state = initialState
      const matrix = selectCellMatrix({ [name]: state })
      // The matrix should have the same number of rows as cellLabelMatrix
      expect(matrix).toHaveLength(state.cellLabelMatrix.length)
      // In the first row, verify that for each column label, the corresponding cell exists
      const firstRow = matrix[0]
      state.columnLabels.forEach((label) => {
        const cellId = state.cellLabelMatrix[0]?.[label]
        if (cellId) {
          expect(firstRow?.[label]).toEqual(state.cells.byId[cellId])
        }
        else {
          throw new Error(`Cell ID not found for column ${label} in the first row`)
        }
      })
    })
  })
})
