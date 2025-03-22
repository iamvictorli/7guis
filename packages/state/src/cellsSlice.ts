import type { PayloadAction } from '@reduxjs/toolkit'

import { createSelector, createSlice } from '@reduxjs/toolkit'

import type { EntityMap } from './types'

export const ROW_COUNT = 10
const COLUMN_COUNT = 10

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

export interface Cell {
  id: string

  /**
   * Children are dependencies cellIds, once the cell is updated, all of the children needs to be updated as well.
   *
   * Should be using Set, but redux does not work with set b/c set is not serializable. https://github.com/reduxjs/redux-toolkit/issues/3197
   */
  children: Record<string, string>

  /** Displayed value of cell. if formula exists and the edit mode is on cell, displayed value is formula */
  computedValue: string

  /** null means cell is not a formula */
  formula: string | null
}

export interface CellsState {
  cells: EntityMap<Cell>

  /**  The columnLabels and cellLabelMatrix property is not part of the state, as it does not change and can probably be derived from the cell IDs. However, they are included in the state for easier access and to provide meta information for the UI. */
  columnLabels: string[]

  /**  Record of columnLabel to cellId, to be later used in selectCellMatrix */
  cellLabelMatrix: Record<string, string>[]
}

function getInitialState(rows: number, columns: number): CellsState {
  const cells: EntityMap<Cell> = {
    byId: {},
  }
  const cellLabelMatrix = []
  const columnLabels = generateColumnLabels(columns)
  for (let rowNumber = 1; rowNumber <= rows; rowNumber++) {
    const cellLabel: Record<string, string> = {}
    columnLabels.forEach((columnLabel) => {
      const id = `${columnLabel}${rowNumber}`
      cellLabel[columnLabel] = id
      cells.byId[id] = {
        id,
        children: {},
        computedValue: '',
        formula: null,
      }
    })
    cellLabelMatrix.push(cellLabel)
  }
  return {
    cells,
    columnLabels,
    cellLabelMatrix,
  }
}

const FORMULA_SYMBOL = '='

export const initialState = getInitialState(
  ROW_COUNT,
  COLUMN_COUNT,
)

/**
 * Splits a formula string into an array of strings, separating them by operators =, +, -, *, /
 * ie =A0+B1 is ['=', 'A0', '+', 'B1']
 */
function splitFormula(formula: string) {
  return formula
    .replace(/\s+/g, '')
    .split(/([=+\-*/])/)
    .filter(char => char !== '')
}

/**
 * Checks if a given symbol is a valid cell ID.
 */
function isCellId(symbol: string) {
  const regex = /^[A-Z]\d|\d{2}$/i
  return regex.test(symbol)
}

/**
 * Retrieves the parent cell IDs from a given formula.
 */
function getParentIds(formula: string) {
  return splitFormula(formula).filter(symbol => isCellId(symbol))
}

function isFormula(string: string) {
  return Number.isNaN(Number(string))
}

/**
 * Cells slice for managing a spreadsheet-like grid with reactive cell updates.
 *
 * Features:
 * - Cells can store static values or formulas.
 * - Formulas are evaluated dynamically and updates propagate to dependent cells.
 * - A dependency graph ensures that changes update only affected cells.
 * - Cyclic dependencies result in an "ERROR" display.
 */
const cellsSlice = createSlice({
  name: 'cells',
  initialState,
  reducers: {
    /**
     * Updates a cell value or formula.
     * If the value is a formula, it updates dependencies and recalculates values.
     */
    cellChanged: (
      state,
      action: PayloadAction<{ id: string, value: string }>,
    ) => {
      // adds childId to parentId's children
      function addChild(parentId: string, childId: string) {
        const parentCell = state.cells.byId[parentId]
        if (parentCell)
          parentCell.children[childId] = childId
      }

      // removes childId to parentId's children
      function removeChild(parentId: string, childId: string) {
        const parentCell = state.cells.byId[parentId]
        if (parentCell)
          delete parentCell.children[childId]
      }

      function evaluateFormula(formula: string) {
        const [firstSymbol, ...rest] = splitFormula(formula)

        if (firstSymbol !== FORMULA_SYMBOL) {
          throw new Error('formula does not start with =')
        }

        const replaceCellsWithValues = rest.map((symbol) => {
          if (isCellId(symbol) && state.cells.byId[symbol]) {
            const computedValue = state.cells.byId[symbol].computedValue
            return computedValue === '' ? 0 : computedValue
          }
          return symbol
        })
        // eslint-disable-next-line no-eval
        const value = eval(replaceCellsWithValues.join('')) as number

        if (Number.isNaN(value)) {
          throw new TypeError('formula does not evaluate to a number')
        }

        return value.toString()
      }

      function calcCell(id: string, visited = new Set<string>()) {
        const cell = state.cells.byId[id]
        if (!cell)
          return
        // no need to calculate cell if cell is not a formula
        const formula = cell.formula
        if (!formula)
          return
        // for detecting cycles in cells and children
        if (visited.has(id)) {
          cell.computedValue = 'ERROR'
          return
        }

        let computedValue: string
        try {
          const value = evaluateFormula(formula)
          computedValue = value
        }
        catch {
          computedValue = 'ERROR'
        }

        cell.computedValue = computedValue
        visited.add(id)
        Object.values(cell.children).forEach((childId) => {
          calcCell(childId, visited)
        })
      }

      const { id, value: newValue } = action.payload
      const cell = state.cells.byId[id]
      if (!cell)
        return

      // if formula exists, check if the editing value is the same as formula
      if (cell.formula !== null && cell.formula === newValue)
        return

      // if formula doesnt exist, check if editing value is the same as computed value
      if (cell.formula === null && cell.computedValue === newValue)
        return

      // remove existing formula, remove cells that were part of this formula
      // ie, =B2+3, removes id from B2
      if (cell.formula) {
        const parentIds = getParentIds(cell.formula)

        parentIds.forEach((parentId) => {
          removeChild(parentId, id)
        })
      }

      // Handle formula parsing and dependency updates
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
      }
      else {
        cell.formula = null
        cell.computedValue = newValue
      }

      // Recalculate the cell and its dependencies
      calcCell(id)

      // update children cells that depend on this cell
      Object.values(cell.children).forEach((childId) => {
        calcCell(childId)
      })
    },
  },
  selectors: {
    selectColumnLabels: state => state.columnLabels,
    selectCellLabelMatrix: state => state.cellLabelMatrix,
    selectCells: state => state.cells,
  },
})

export const { name, reducer } = cellsSlice

const { actions, selectors } = cellsSlice
export const { cellChanged } = actions
export const { selectColumnLabels } = selectors
const { selectCells, selectCellLabelMatrix } = selectors

export const selectCellMatrix = createSelector(
  [selectCellLabelMatrix, selectCells],
  (cellLabelMatrix, cells) => {
    return cellLabelMatrix.map((cellLabel) => {
      const row: Record<string, Cell> = {}
      Object.entries(cellLabel).forEach(([columnLabel, cellId]) => {
        row[columnLabel] = cells.byId[cellId]!
      })
      return row
    })
  },
)
