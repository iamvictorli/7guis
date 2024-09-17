import { useEffect, useState } from 'react'
import type { KeyboardEvent } from 'react'

// props to have
// columns, 'A', 'B', 'C'
// data: data row

// hook to manage focus cell
// bring ref out to focus

// no initial focus, tablIndex 0 outer, but when it does does focused -1 outer, but cell has tabIndex 0, others -1

// onChangeCell?
// focused column header, focused row header

// useSpreadSheetState(props)
// useSpreadSheetCell(state, props, ref)?

// changes to row number, and column label
// focused cell should be the same row number
// render individual cell, Spreadsheet Cell

// use an interface of Cell, and use renderProp, similar to ListBox
// TODO: check if aria properties are set properly

// integrate with current slice first
// define props for each hook, define the props for each hook, so it can be used as for js spread

export default function Spreadsheet({
  data,
  columns,
  onCellChange,
}: {
  data: Record<string, string>[]
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

  // State to store the previous value of a cell before editing
  const [prevValue, setPrevValue] = useState<string>('')

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
  const enterEditMode = (row: number, col: number) => {
    setPrevValue(data[row][col]) // Store previous value
    setEditCell({ row, col }) // Set the cell in edit mode
  }

  // Function to exit edit mode
  const exitEditMode = () => {
    setEditCell(null) // Exit edit mode
  }

  // Function to cancel editing and restore previous value
  const cancelEditMode = () => {
    if (editCell) {
      const { row, col } = editCell
      onCellChange({ rowIndex: row, colIndex: col, value: prevValue })
      setEditCell(null)
    }
  }

  // Function to handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: number,
    col: number,
  ) => {
    onCellChange({ rowIndex: row, colIndex: col, value: e.target.value })
  }

  // Function to handle keyboard navigation and interactions
  const handleKeyDown = (
    e: KeyboardEvent<HTMLDivElement>,
    row: number,
    col: number,
  ) => {
    const isFirstCell = row === 0 && col === 0
    const isLastCell = row === data.length - 1 && col === columns.length - 1

    if (e.key === 'Enter') {
      if (editCell && editCell.row === row && editCell.col === col) {
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
        // Toggle edit mode
        exitEditMode()
      } else {
        enterEditMode(row, col)
      }
    } else if (e.key === 'Escape') {
      // Cancel edit mode
      cancelEditMode()
    } else if (e.key === 'ArrowRight') {
      // Move focus right
      if (col + 1 < columns.length) {
        setFocusedCell({ row, col: col + 1 })
      }
    } else if (e.key === 'ArrowLeft') {
      // Move focus left
      if (col - 1 >= 0) {
        setFocusedCell({ row, col: col - 1 })
      }
    } else if (e.key === 'ArrowDown') {
      // Move focus down
      if (row + 1 < data.length) {
        setFocusedCell({ row: row + 1, col })
      }
    } else if (e.key === 'ArrowUp') {
      // Move focus up
      if (row - 1 >= 0) {
        setFocusedCell({ row: row - 1, col })
      }
    } else if (e.key === 'Tab') {
      if (
        // Pressing "Tab" on the last cell without "Shift"
        (!e.shiftKey && isLastCell) ||
        // Pressing "Shift+Tab" on the first cell
        (e.shiftKey && isFirstCell)
      ) {
        // Allow default behavior to let focus move out of the grid
        return
      } else {
        e.preventDefault() // Prevent default tab behavior
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
              className={`flex h-8 w-16 items-center justify-center border border-gray-300 bg-gray-100 ${
                focusedCell && focusedCell.col === columnIndex
                  ? 'bg-blue-100'
                  : ''
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
            className={`flex h-8 w-16 items-center justify-center border border-gray-300 bg-gray-100 ${
              focusedCell && focusedCell.row === rowIndex ? 'bg-blue-100' : ''
            }`}>
            {rowIndex + 1}
          </div>

          {/* Render cells */}
          {columns
            .map((column) => dataRow[column])
            .map((_, colIndex) => {
              const cellValue = data[rowIndex][colIndex]
              const isFocused =
                focusedCell &&
                focusedCell.row === rowIndex &&
                focusedCell.col === colIndex
              const isEditing =
                editCell &&
                editCell.row === rowIndex &&
                editCell.col === colIndex

              return (
                <div
                  key={colIndex}
                  id={`cell-${rowIndex}-${colIndex}`} // Assign unique ID
                  role="gridcell"
                  aria-rowindex={rowIndex + 1}
                  aria-colindex={colIndex + 1}
                  tabIndex={0} // TODO: Focus management grid to be only focusable
                  className={`flex h-8 w-16 items-center justify-center border border-gray-300 ${
                    isFocused ? 'border-blue-500' : ''
                  }`}
                  onFocus={() =>
                    setFocusedCell({ row: rowIndex, col: colIndex })
                  }
                  onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}>
                  {isEditing ? (
                    <input
                      type="text"
                      className="h-full w-full focus:outline-none"
                      value={cellValue}
                      onChange={(e) => handleChange(e, rowIndex, colIndex)}
                      onBlur={() => exitEditMode()}
                      autoFocus
                    />
                  ) : (
                    cellValue
                  )}
                </div>
              )
            })}
        </div>
      ))}
    </div>
  )
}
