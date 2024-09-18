import { useEffect, useState } from 'react'
import type { KeyboardEvent } from 'react'

import type { Cell } from 'state/cellsSlice'

// hook to manage focus cell
// bring ref out to focus

// useSpreadSheetState(props)
// useSpreadSheetCell(state, props, ref)?

// changes to row number, and column label
// focused cell should be the same row number
// render individual cell, Spreadsheet Cell
// use an interface of Cell, and use renderProp, similar to ListBox
// define props for each hook, define the props for each hook, so it can be used as for js spread

// check with browser, and focus

// aria tags are to be the same
// focused cell should be highlighted, col/row header to be colored
// when in edit cell, up/left/right/down does nothing, tab changes cell and goes to the right, enter changes cell and goes down,
// escape stays in same cell, but leaves edit mode

// arrow keys works
// tab leaves focus elsewhere
// tabIndex stays the same

// colors
// performance with a bunch of rows and columns, would using an individual selector work better?

export default function Spreadsheet({
  data,
  columns,
  onCellChange,
}: {
  data: Record<string, Cell>[]
  columns: string[]
  onCellChange: ({
    rowIndex,
    colIndex,
    value,
  }: {
    rowIndex: number
    colIndex: number
    value: string
  }) => void
}) {
  // State for the currently focused cell
  const [focusedCell, setFocusedCell] = useState<{
    row: number
    col: number
  } | null>(null)

  // State for the cell that is in edit mode
  const [editCell, setEditCell] = useState<{ row: number; col: number } | null>(
    null,
  )
  const [inputValue, setInputValue] = useState('')
  // Effect to focus the new cell when focusedCell changes
  useEffect(() => {
    if (focusedCell) {
      // Check if the focused cell is not in edit mode
      if (
        !editCell ||
        editCell.row !== focusedCell.row ||
        editCell.col !== focusedCell.col
      ) {
        const cellId = `cell-${focusedCell.row}-${focusedCell.col}`
        const cellElement = document.getElementById(cellId)
        if (cellElement) {
          cellElement.focus()
        }
      }
    }
  }, [focusedCell, editCell])

  // Function to enter edit mode
  function enterEditMode(row: number, col: number) {
    const cell = data[row][columns[col]]
    setInputValue(cell.formula ?? cell.computedValue ?? '')
    setEditCell({ row, col }) // Set the cell in edit mode
  }

  // Function to exit edit mode
  function exitEditMode() {
    setEditCell(null) // Exit edit mode
  }

  // Function to cancel editing and restore previous value
  function cancelEditMode() {
    if (editCell) {
      setEditCell(null)
    }
  }

  function cellChange() {
    if (editCell) {
      onCellChange({
        rowIndex: editCell.row,
        colIndex: editCell.col,
        value: inputValue,
      })
    }
  }

  // Function to handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value)
  }

  // Function to handle keyboard navigation and interactions
  function handleKeyDown(
    e: KeyboardEvent<HTMLDivElement>,
    row: number,
    col: number,
  ) {
    if (e.key === 'Enter') {
      if (editCell && editCell.row === row && editCell.col === col) {
        cellChange()

        // If already in edit mode, exit and move focus down
        exitEditMode()
        if (row + 1 < data.length) {
          setFocusedCell({ row: row + 1, col })
        }
      } else {
        // Enter edit mode
        enterEditMode(row, col)
      }
    } else if (e.key === 'F2') {
      if (editCell && editCell.row === row && editCell.col === col) {
        cellChange()

        // Toggle edit mode
        exitEditMode()
      } else {
        enterEditMode(row, col)
      }
    } else if (e.key === 'Escape') {
      // Cancel edit mode
      cancelEditMode()
    } else if (e.key === 'ArrowRight') {
      // on edit mode, doesnt do anything
      if (editCell) return

      cellChange()

      // Move focus right
      if (col + 1 < columns.length) {
        setFocusedCell({ row, col: col + 1 })
      }
    } else if (e.key === 'ArrowLeft') {
      // on edit mode, doesnt do anything
      if (editCell) return
      cellChange()

      // Move focus left
      // onChange
      if (col - 1 >= 0) {
        setFocusedCell({ row, col: col - 1 })
      }
    } else if (e.key === 'ArrowDown') {
      // on edit mode, doesnt do anything
      if (editCell) return
      cellChange()

      // Move focus down
      // onChange
      if (row + 1 < data.length) {
        setFocusedCell({ row: row + 1, col })
      }
    } else if (e.key === 'ArrowUp') {
      // on edit mode, doesnt do anything
      if (editCell) return
      cellChange()

      // Move focus up
      // onChange
      if (row - 1 >= 0) {
        setFocusedCell({ row: row - 1, col })
      }
    } else if (e.key === 'Tab') {
      if (editCell) {
        e.preventDefault() // Prevent default tab behavior
        cellChange()
        // Move focus to next or previous cell
        let nextRow = row
        let nextCol = col + (e.shiftKey ? -1 : 1)

        // Handle wrapping to next/previous row
        if (nextCol >= columns.length) {
          nextCol = 0
          nextRow = row + 1
        } else if (nextCol < 0) {
          nextCol = columns.length - 1
          nextRow = row - 1
        }

        // Check bounds and update focusedCell
        if (nextRow >= 0 && nextRow < data.length) {
          setFocusedCell({ row: nextRow, col: nextCol })
        }
      }
    }
  }

  // Render the grid
  return (
    <div
      role="grid"
      aria-label="Spreadsheet"
      aria-rowcount={data.length + 1} // +1 to include header row
      aria-colcount={columns.length + 1} // +1 to include header column
      className="inline-block border border-gray-300">
      {/* Render first row with column names */}
      <div role="row" className="flex">
        {/* Top-left cornder cell (empty) */}
        <div
          role="gridcell"
          aria-readonly="true"
          className="h-8 w-16 border border-gray-300 bg-gray-100"
        />

        {columns.map((column, columnIndex) => {
          return (
            <div
              key={column}
              role="columnheader"
              aria-readonly="true"
              aria-colindex={columnIndex + 1}
              className={`flex h-8 w-16 items-center justify-center border border-gray-300 ${
                focusedCell && focusedCell.col === columnIndex
                  ? 'bg-blue-100'
                  : 'bg-gray-100'
              }`}>
              {column}
            </div>
          )
        })}
      </div>

      {/* Render rows */}
      {data.map((dataRow, rowIndex) => (
        <div role="row" key={rowIndex} className="flex">
          {/* Render row header */}
          <div
            role="rowheader"
            aria-readonly="true"
            aria-rowindex={rowIndex + 1}
            className={`flex h-8 w-16 items-center justify-center border border-gray-300 ${
              focusedCell && focusedCell.row === rowIndex
                ? 'bg-blue-100'
                : 'bg-gray-100'
            }`}>
            {rowIndex + 1}
          </div>

          {/* Render cells */}
          {columns.map((column, colIndex) => {
            const cell = dataRow[column]
            const isFocused =
              focusedCell &&
              focusedCell.row === rowIndex &&
              focusedCell.col === colIndex
            const isEditing =
              editCell && editCell.row === rowIndex && editCell.col === colIndex

            return (
              <div
                key={colIndex}
                id={`cell-${rowIndex}-${colIndex}`} // Assign unique ID
                role="gridcell"
                aria-rowindex={rowIndex + 1}
                aria-colindex={colIndex + 1}
                aria-selected={isFocused ?? false}
                tabIndex={
                  // if there is no focused cell, make the first cell tabIndex of 0
                  focusedCell
                    ? isFocused
                      ? 0
                      : -1
                    : rowIndex === 0 && colIndex === 0
                      ? 0
                      : -1
                }
                className={`flex h-8 w-16 items-center justify-center border ${
                  isFocused ? 'border-blue-500' : 'border-gray-300'
                }`}
                onFocus={() => setFocusedCell({ row: rowIndex, col: colIndex })}
                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                onClick={() => {
                  setFocusedCell({ row: rowIndex, col: colIndex })
                }}>
                {isEditing ? (
                  <input
                    type="text"
                    className="h-full w-full focus:outline-none"
                    value={inputValue}
                    onChange={(e) => handleChange(e)}
                    onBlur={() => {
                      cellChange()
                      exitEditMode()
                    }}
                    autoFocus
                  />
                ) : (
                  cell.computedValue
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
