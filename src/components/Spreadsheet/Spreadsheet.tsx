import { cn } from '~/lib/utils'
import { memo, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

import type { Cell } from 'state/cellsSlice'

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

interface SpreadsheetCellProps {
  row: number
  col: number
  onCellChange: (value: string) => void
  cell: Cell
  isFocused: boolean
  focusCell: (row: number, col: number) => void
  focusCurrentCell: () => void
  hasSpreadsheetBeenFocused: boolean
  dataLength: number
  columnLength: number
}

const SpreadsheetCell = memo(
  function SpreadsheetCell({
    row,
    col,
    onCellChange,
    cell,
    isFocused,
    focusCell,
    focusCurrentCell,
    hasSpreadsheetBeenFocused,
    dataLength,
    columnLength,
  }: SpreadsheetCellProps) {
    const [inputValue, setInputValue] = useState('')
    const [isEditing, setIsEditing] = useState(false)

    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      if (isFocused && ref.current && !isEditing) {
        ref.current.focus()
      }
    }, [isFocused, isEditing])

    function cellChange() {
      if (isEditing) {
        onCellChange(inputValue)
      }
    }

    // Function to exit edit mode
    function exitEditMode() {
      setIsEditing(false) // Exit edit mode
    }

    // Function to enter edit mode
    function enterEditMode() {
      setIsEditing(true) // Set the cell in edit mode
    }

    // Function to cancel editing
    function cancelEditMode() {
      if (isEditing) {
        setIsEditing(false)
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
          enterEditMode()
        }
      } else if (e.key === 'F2') {
        if (isEditing) {
          cellChange()

          // Toggle edit mode
          exitEditMode()
        } else {
          setInputValue(cell.formula ?? cell.computedValue ?? '')
          enterEditMode()
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
        role="gridcell"
        aria-rowindex={row + 2} // adding 2, for 0 based and column header row
        aria-colindex={col + 2} // adding 2, for 0 based and extra column for row header
        aria-selected={isFocused}
        // if spreadsheet hasnt been focused yet, make the first cell tabIndex Of 0
        // else tabIndex of 0 for the current focused cell
        tabIndex={
          hasSpreadsheetBeenFocused
            ? isFocused
              ? 0
              : -1
            : row === 0 && col === 0
              ? 0
              : -1
        }
        className={cn(
          'flex h-8 w-16 items-center justify-center border',
          isFocused ? 'border-blue-500' : 'border-gray-300',
        )}
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
    // Re-render if isFocused changes
    if (prevProps.isFocused !== nextProps.isFocused) {
      return false // Props have changed, re-render
    }

    if (prevProps.cell.computedValue !== nextProps.cell.computedValue) {
      return false
    }

    // Otherwise, do not re-render
    return true
  },
)

const RowHeader = memo(function RowHeader({
  isFocusedRow,
  row,
  rowIndex,
}: {
  isFocusedRow: boolean
  row: number
  rowIndex: number
}) {
  return (
    <div
      role="rowheader"
      aria-readonly="true"
      aria-colindex={1}
      aria-rowindex={rowIndex}
      className={cn(
        'flex h-8 w-16 items-center justify-center border border-gray-300',
        isFocusedRow ? 'bg-blue-100' : 'bg-gray-100',
      )}>
      {row}
    </div>
  )
})

const ColHeader = memo(function ColHeader({
  isFocusedCol,
  columnLabel,
  colIndex,
}: {
  isFocusedCol: boolean
  columnLabel: string
  colIndex: number
}) {
  return (
    <div
      role="columnheader"
      aria-readonly="true"
      aria-rowindex={1}
      aria-colindex={colIndex}
      className={cn(
        'flex h-8 w-16 items-center justify-center border border-gray-300',
        isFocusedCol ? 'bg-blue-100' : 'bg-gray-100',
      )}>
      {columnLabel}
    </div>
  )
})

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
          aria-rowindex={1}
          aria-colindex={1}
          className="h-8 w-16 border border-gray-300 bg-gray-100"
        />

        {columns.map((column, columnIndex) => {
          return (
            <ColHeader
              key={columnIndex}
              isFocusedCol={focusedCell?.col === columnIndex}
              columnLabel={column}
              colIndex={columnIndex + 2} // adding 2, +1 b/c of 0 based, +1 for the top left corner cell
            />
          )
        })}
      </div>

      {/* Render rows */}
      {data.map((dataRow, rowIndex) => (
        <div role="row" key={rowIndex} className="flex">
          <RowHeader
            isFocusedRow={focusedCell?.row === rowIndex}
            row={rowIndex + 1}
            rowIndex={rowIndex + 2} // adding 2, +1 b/c 0 based, +1 from column header row
          />

          {/* Render cells */}
          {columns.map((column, colIndex) => {
            const cell = dataRow[column]
            return (
              <SpreadsheetCell
                key={cell.id}
                row={rowIndex}
                col={colIndex}
                onCellChange={(value) =>
                  onCellChange({ rowIndex, colIndex, value })
                }
                cell={cell}
                isFocused={Boolean(
                  focusedCell &&
                    focusedCell.row === rowIndex &&
                    focusedCell.col === colIndex,
                )}
                focusCell={(row, col) => setFocusedCell({ row, col })}
                focusCurrentCell={() =>
                  setFocusedCell({ row: rowIndex, col: colIndex })
                }
                hasSpreadsheetBeenFocused={!!focusedCell}
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
