import { memo, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

import type { Cell } from 'state/cellsSlice'

// hook to manage focus cell
// bring ref out to focus

// useSpreadSheetState(props)

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

function useSpreadsheetCell({
  row,
  col,
  setFocusedCell,
  setEditCell,
  isEditing,
  isFocused,
}: {
  row: number
  col: number
  setFocusedCell: React.Dispatch<
    React.SetStateAction<{
      row: number
      col: number
    } | null>
  >
  setEditCell: React.Dispatch<
    React.SetStateAction<{
      row: number
      col: number
    } | null>
  >
  isEditing: boolean
  isFocused: boolean
}) {
  function focusCell(row: number, col: number) {
    setFocusedCell({ row, col })
  }

  function focusCurrentCell() {
    focusCell(row, col)
  }

  // Function to exit edit mode
  function exitEditMode() {
    setEditCell(null) // Exit edit mode
  }

  // Function to enter edit mode
  function enterEditMode(row: number, col: number) {
    setEditCell({ row, col }) // Set the cell in edit mode
  }

  // Function to cancel editing and restore previous value
  function cancelEditMode() {
    if (isEditing) {
      setEditCell(null)
    }
  }

  const cellProps = {
    role: 'gridcell',
    ['aria-rowindex']: row + 1,
    ['aria-colindex']: col + 1,
    ['aria-selected']: isFocused ?? false,
    tabIndex:
      // if there is no focused cell, make the first cell tabIndex of 0
      // focusedCell ? (isFocused ? 0 : -1) : row === 0 && col === 0 ? 0 : -1,
      isFocused ? 0 : -1,
  }

  return {
    cellProps,
    isFocused,
    focusCell,
    focusCurrentCell,
    exitEditMode,
    enterEditMode,
    cancelEditMode,
  }
}

interface SpreadsheetCellProps {
  row: number
  col: number
  setFocusedCell: React.Dispatch<
    React.SetStateAction<{
      row: number
      col: number
    } | null>
  >
  setEditCell: React.Dispatch<
    React.SetStateAction<{
      row: number
      col: number
    } | null>
  >
  onCellChange: ({
    rowIndex,
    colIndex,
    value,
  }: {
    rowIndex: number
    colIndex: number
    value: string
  }) => void
  cell: Cell
  isEditing: boolean
  isFocused: boolean
  dataLength: number
  columnLength: number
}

const SpreadsheetCell = memo(
  function SpreadsheetCell({
    row,
    col,
    setFocusedCell,
    setEditCell,
    onCellChange,
    cell,
    isEditing,
    isFocused,
    dataLength,
    columnLength,
  }: SpreadsheetCellProps) {
    const [inputValue, setInputValue] = useState('')

    const ref = useRef<HTMLDivElement | null>(null)

    const {
      cellProps,
      focusCell,
      focusCurrentCell,
      exitEditMode,
      enterEditMode,
      cancelEditMode,
    } = useSpreadsheetCell({
      row,
      col,
      setFocusedCell,
      setEditCell,
      isEditing,
      isFocused,
    })

    useEffect(() => {
      if (isFocused && ref.current && !isEditing) {
        ref.current.focus()
      }
    }, [isFocused, isEditing])

    function cellChange() {
      if (isEditing) {
        onCellChange({
          rowIndex: row,
          colIndex: col,
          value: inputValue,
        })
      }
    }

    // Function to handle input changes
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      setInputValue(e.target.value)
    }

    // Function to handle keyboard navigation and interactions
    function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
      if (e.key === 'Enter') {
        if (isEditing) {
          cellChange()

          // If already in edit mode, exit and move focus down
          exitEditMode()
          if (row + 1 < dataLength) {
            focusCell(row + 1, col)
          }
        } else {
          // Enter edit mode
          setInputValue(cell.formula ?? cell.computedValue ?? '')
          enterEditMode(row, col)
        }
      } else if (e.key === 'F2') {
        if (isEditing) {
          cellChange()

          // Toggle edit mode
          exitEditMode()
        } else {
          setInputValue(cell.formula ?? cell.computedValue ?? '')
          enterEditMode(row, col)
        }
      } else if (e.key === 'Escape') {
        // Cancel edit mode
        cancelEditMode()
      } else if (e.key === 'ArrowRight') {
        // on edit mode, doesn't do anything
        if (isEditing) return

        cellChange()

        // Move focus right
        if (col + 1 < columnLength) {
          focusCell(row, col + 1)
        }
      } else if (e.key === 'ArrowLeft') {
        // on edit mode, doesn't do anything
        if (isEditing) return
        cellChange()

        // Move focus left
        if (col - 1 >= 0) {
          focusCell(row, col - 1)
        }
      } else if (e.key === 'ArrowDown') {
        // on edit mode, doesn't do anything
        if (isEditing) return
        cellChange()

        // Move focus down
        if (row + 1 < dataLength) {
          focusCell(row + 1, col)
        }
      } else if (e.key === 'ArrowUp') {
        // on edit mode, doesn't do anything
        if (isEditing) return
        cellChange()

        // Move focus up
        if (row - 1 >= 0) {
          focusCell(row - 1, col)
        }
      } else if (e.key === 'Tab') {
        if (isEditing) {
          e.preventDefault() // Prevent default tab behavior
          cellChange()
          // Move focus to next or previous cell
          let nextRow = row
          let nextCol = col + (e.shiftKey ? -1 : 1)

          // Handle wrapping to next/previous row
          if (nextCol >= columnLength) {
            nextCol = 0
            nextRow = row + 1
          } else if (nextCol < 0) {
            nextCol = columnLength - 1
            nextRow = row - 1
          }

          // Check bounds and update focusedCell
          if (nextRow >= 0 && nextRow < dataLength) {
            focusCell(nextRow, nextCol)
          }
        }
      }
    }

    return (
      <div
        ref={ref}
        {...cellProps}
        className={`flex h-8 w-16 items-center justify-center border ${
          isFocused ? 'border-blue-500' : 'border-gray-300'
        }`}
        onFocus={() => focusCurrentCell()}
        onKeyDown={(e) => handleKeyDown(e)}
        onClick={() => {
          focusCurrentCell()
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
  },
  (prevProps, nextProps) => {
    // Re-render if isFocused or isEditing changes
    if (
      prevProps.isFocused !== nextProps.isFocused ||
      prevProps.isEditing !== nextProps.isEditing
    ) {
      return false // Props have changed, re-render
    }

    if (prevProps.cell.computedValue !== nextProps.cell.computedValue) {
      return false
    }

    // Otherwise, do not re-render
    return true
  },
)

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
        {/* Top-left corner cell (empty) */}
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
            return (
              <SpreadsheetCell
                key={cell.id}
                row={rowIndex}
                col={colIndex}
                setFocusedCell={setFocusedCell}
                setEditCell={setEditCell}
                onCellChange={onCellChange}
                cell={cell}
                isEditing={Boolean(
                  editCell &&
                    editCell.row === rowIndex &&
                    editCell.col === colIndex,
                )}
                isFocused={Boolean(
                  focusedCell &&
                    focusedCell.row === rowIndex &&
                    focusedCell.col === colIndex,
                )}
                dataLength={data.length}
                columnLength={columns.length}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
