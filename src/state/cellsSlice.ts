import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { EntityMap } from './types'

const ROW_COUNT = 3
const COLUMN_COUNT = 3

const ALPHABET_START = 65 // ASCII value for 'A'
const ALPHABET_COUNT = 26 // Total number of letters in the alphabet

// Generate excel style column labels of length n
// ie, 4 => ['A', 'B', 'C', 'D']
function generateColumnLabels(n: number) {
  // Helper function to convert a number to an Excel column label
  function getColumnLabel(num: number) {
    let label = ''
    while (num > 0) {
      const remainder = (num - 1) % ALPHABET_COUNT
      label = String.fromCharCode(ALPHABET_START + remainder) + label
      num = Math.floor((num - 1) / ALPHABET_COUNT)
    }
    return label
  }

  const result = []
  for (let i = 1; i <= n; i++) {
    result.push(getColumnLabel(i))
  }

  return result
}

interface Cell {
  id: string
  children: string[] // holds child ids
  computedValue: string // displayed value of cell. if formula exists and the edit mode is on cell, displayed value is formula
  formula: string | null // null means cell is not a formula
}

interface CellsState {
  // TODO: do i need entity map of cell? Think just cellRows and columnLabel are just needed
  cells: EntityMap<Cell>
  // The columnLabels and cellRows property is not part of the state, as it does not change and can probably be derived from the cell IDs. However, they are included in the state for easier access and to provide meta information for the UI.
  columnLabels: string[]
  cellRows: Record<string, Cell>[]
  ui: {
    selectedCellId: string | null
    selectedCellIdInputValue: string
  }
}

function getInitialState(rows: number, columns: number): CellsState {
  const cells: EntityMap<Cell> = {
    byId: {},
    allIds: [],
  }
  const cellRows = []
  const columnLabels = generateColumnLabels(columns)
  for (let rowNumber = 1; rowNumber <= rows; rowNumber++) {
    const cellRow: Record<string, Cell> = {}
    columnLabels.forEach((columnLabel) => {
      const id = `${columnLabel}${rowNumber}`
      cells.allIds.push(id)
      const cell: Cell = {
        id,
        children: [],
        computedValue: '',
        formula: null,
      }
      cells.byId[id] = cell
      cellRow[columnLabel] = cell
    })
    cellRows.push(cellRow)
  }
  return {
    cells,
    columnLabels,
    cellRows,
    ui: {
      selectedCellId: null,
      selectedCellIdInputValue: '',
    },
  }
}

const FORMULA_SYMBOL = '='

const initialState = getInitialState(
  ROW_COUNT,
  COLUMN_COUNT,
) satisfies CellsState

/**
 * Splits a formula string into an array of strings, separating them by operators =, +, -, *, /
 * ie =A0+B1 is ['=', 'A0', '+', 'B1']
 */
function splitFormula(formula: string) {
  return formula
    .replace(/\s+/g, '')
    .split(/(=|\+|-|\*|\/)/)
    .filter((char) => char !== '')
}

/**
 * Checks if a given symbol is a valid cell ID.
 */
function isCellId(symbol: string) {
  const regex = new RegExp(/^([A-Za-z])([0-9]{1}|[0-9]{2})$/)
  return regex.test(symbol)
}

/**
 * Retrieves the parent cell IDs from a given formula.
 */
function getParentIds(formula: string) {
  return splitFormula(formula).filter((symbol) => isCellId(symbol))
}

function isFormula(string: string) {
  return isNaN(Number(string))
}

const cellsSlice = createSlice({
  name: 'cells',
  initialState,
  reducers: {
    cellChanged: (
      state,
      action: PayloadAction<{ id: string; value: string }>,
    ) => {
      // adds childId to parentId's children
      function addChild(parentId: string, childId: string) {
        const parentCell = state.cells.byId[parentId]
        const index = parentCell.children.findIndex((id) => id === childId)
        if (index === -1) parentCell.children.push(childId)
      }

      // removes childId to parentId's children
      function removeChild(parentId: string, childId: string) {
        const parentCell = state.cells.byId[parentId]
        const index = parentCell.children.findIndex((id) => id === childId)
        if (index !== -1) parentCell.children.splice(index, 1)
      }

      function evaluateFormula(formula: string) {
        const [firstSymbol, ...rest] = splitFormula(formula)

        if (firstSymbol !== FORMULA_SYMBOL) {
          throw Error()
        }

        const replaceCellsWithValues = rest.map((symbol) => {
          if (isCellId(symbol)) {
            const computedValue = state.cells.byId[symbol].computedValue
            return computedValue === '' ? 0 : computedValue
          }
          return symbol
        })
        const value = eval(replaceCellsWithValues.join('')) as number

        if (isNaN(value)) {
          throw Error()
        }

        return value.toString()
      }

      function calcCell(id: string, visited = new Set<string>()) {
        const cell = state.cells.byId[id]
        // no need to calculate cell if cell is not a formula
        const formula = cell.formula
        if (!formula) return
        // for detecting cycles in cells and children
        if (visited.has(id)) {
          cell.computedValue = 'ERROR'
          return
        }

        let computedValue: string
        try {
          const value = evaluateFormula(formula)
          computedValue = value
        } catch {
          computedValue = 'ERROR'
        }

        cell.computedValue = computedValue
        visited.add(id)
        cell.children.forEach((childId) => {
          calcCell(childId, visited)
        })
      }

      const { id, value: newValue } = action.payload
      const cell = state.cells.byId[id]

      state.ui.selectedCellId = null
      state.ui.selectedCellIdInputValue = ''

      // if formula exists, check if the editting value is the same as formula
      if (cell.formula !== null && cell.formula === newValue) return

      // if formula doesnt exist, check if editting value is the same as computed value
      if (cell.formula === null && cell.computedValue === newValue) return

      // remove existing formula, remove cells that were part of this formula
      // ie, =B2+3, removes id from B2
      if (cell.formula) {
        const parentIds = getParentIds(cell.formula)

        parentIds.forEach((parentId) => {
          removeChild(parentId, id)
        })
      }

      // if formula, update new parent ids
      // else set computed value
      if (isFormula(newValue)) {
        // update new parent ids
        const parentIds = getParentIds(newValue)
        parentIds.forEach((parentId) => {
          addChild(parentId, id)
        })
        cell.formula = newValue
        cell.computedValue = ''
      } else {
        cell.formula = null
        cell.computedValue = newValue
      }
      calcCell(id)

      // update children cells that depend on this cell
      cell.children.forEach((childId) => {
        calcCell(childId)
      })
    },
    cellSelected: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const cell = state.cells.byId[id]

      state.ui.selectedCellId = id
      state.ui.selectedCellIdInputValue = cell.formula ?? cell.computedValue
    },
    cellInputChanged: (state, action: PayloadAction<string>) => {
      const value = action.payload
      state.ui.selectedCellIdInputValue = value
    },
  },
  selectors: {
    selectColumnLabels: (state) => state.columnLabels,
    selectCellRows: (state) => state.cellRows,
    selectCellbyId: (state, id: string) => state.cells.byId[id],
    selectIsSelected: (state, id: string) => state.ui.selectedCellId === id,
    selectUIInputValue: (state) => state.ui.selectedCellIdInputValue,
  },
})

export const { selectColumnLabels, selectCellRows, selectIsSelected } =
  cellsSlice.selectors

const { selectCellbyId, selectUIInputValue } = cellsSlice.selectors

export const selectInputValue = createSelector(
  [selectIsSelected, selectUIInputValue, selectCellbyId],
  (isSelected, uiInputValue, cell) =>
    isSelected ? uiInputValue : cell.computedValue,
)

export const { cellChanged, cellSelected, cellInputChanged } =
  cellsSlice.actions

export const CELLS_REDUCER_NAME = cellsSlice.name

export default cellsSlice.reducer
