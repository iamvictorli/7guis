import { memo, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

import {
  cellChanged,
  selectCellMatrix,
  selectColumnLabels,
} from '@7gui/state/cellsSlice'
import type { Cell } from '@7gui/state/cellsSlice'

import { cn } from '~/lib/utils'
import SpreadSheet from '~/components/Spreadsheet/Spreadsheet'
import type {
  CellProps,
  ColHeaderProps,
  RowHeaderProps,
} from '~/components/Spreadsheet/Spreadsheet'
import { useAppDispatch, useAppSelector } from '~/store'

const RowHeader = memo(function RowHeader({
  isFocusedRow,
  row,
  ...props
}: RowHeaderProps) {
  return (
    <div
      {...props}
      className={cn(
        'flex h-8 w-16 items-center justify-center border border-[var(--gray-a6)]',
        isFocusedRow ? 'bg-[var(--accent-a5)]' : 'bg-[var(--gray-a2)]',
      )}>
      {row}
    </div>
  )
})

const ColHeader = memo(function ColHeader({
  isFocusedCol,
  columnLabel,
  ...props
}: Omit<ColHeaderProps, 'columnIndex'>) {
  return (
    <div
      {...props}
      className={cn(
        'flex h-8 w-16 items-center justify-center border border-[var(--gray-a6)]',
        isFocusedCol ? 'bg-[var(--accent-a5)]' : 'bg-[var(--gray-a2)]',
      )}>
      {columnLabel}
    </div>
  )
})

const SpreadsheetCell = memo(
  function SpreadsheetCell({
    cell,
    row,
    col,
    isFocused,
    onCellChange,
    focusCell,
    focusCurrentCell,
    dataLength,
    columnLength,
    ariaProps,
    tabIndex = 0,
  }: CellProps<Cell> & { tabIndex?: number }) {
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
      if (e.key === 'Enter' || e.key === 'F2') {
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
      } else if (e.key === 'Escape') {
        // Cancel edit mode
        cancelEditMode()
      } else if (e.key === 'ArrowRight') {
        // on edit mode, doesn't do anything
        if (isEditing) return

        // Move focus right
        if (col + 1 < columnLength) {
          focusCell(row, col + 1)
        }
      } else if (e.key === 'ArrowLeft') {
        // on edit mode, doesn't do anything
        if (isEditing) return
        // Move focus left
        if (col - 1 >= 0) {
          focusCell(row, col - 1)
        }
      } else if (e.key === 'ArrowDown') {
        // on edit mode, doesn't do anything
        if (isEditing) return
        // Move focus down
        if (row + 1 < dataLength) {
          focusCell(row + 1, col)
        }
      } else if (e.key === 'ArrowUp') {
        // on edit mode, doesn't do anything
        if (isEditing) return
        // Move focus up
        if (row - 1 >= 0) {
          focusCell(row - 1, col)
        }
      } else if (e.key === 'Tab') {
        if (isEditing) {
          e.preventDefault() // Prevent default tab behavior
          exitEditMode()
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
        {...ariaProps}
        tabIndex={tabIndex}
        ref={ref}
        className={cn(
          'flex h-8 w-16 items-center justify-center border focus:outline focus:outline-1 focus:outline-[var(--focus-10)]',
          isFocused ? 'border-[var(--accent-a9)]' : 'border-[var(--gray-a6)]',
        )}
        onFocus={() => focusCurrentCell()}
        onKeyDown={(e) => handleKeyDown(e)}
        onClick={() => {
          focusCurrentCell()
        }}
        onDoubleClick={() => {
          focusCurrentCell()
          enterEditMode()
        }}>
        {isEditing ? (
          <input
            id={`input-${cell.id}`}
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
      return false
    }

    // Re-render if the cells computedValue has changed
    if (prevProps.cell.computedValue !== nextProps.cell.computedValue) {
      return false
    }

    // Otherwise, do not re-render
    return true
  },
)

export default function Cells() {
  const columnLabels = useAppSelector(selectColumnLabels)
  const cellMatrix = useAppSelector(selectCellMatrix)
  const dispatch = useAppDispatch()

  return (
    <SpreadSheet
      data={cellMatrix}
      columns={columnLabels}
      onCellChange={({ rowIndex, colIndex, value }) => {
        dispatch(
          cellChanged({
            id: `${columnLabels[colIndex]}${rowIndex + 1}`,
            value,
          }),
        )
      }}
      label="Spreadsheet"
      renderGridContainer={(gridProps) => {
        return (
          <div
            {...gridProps}
            className="inline-block rounded-[var(--radius-1)] border border-solid border-[var(--gray-a6)]"
          />
        )
      }}
      renderTopRowContainer={(topRowProps) => {
        return <div {...topRowProps} className="flex" />
      }}
      renderTopLeftCorner={(cornerProps) => {
        return (
          <div
            {...cornerProps}
            className="h-8 w-16 border border-[var(--gray-a6)] bg-[var(--gray-a2)]"
          />
        )
      }}
      renderColHeader={({ columnIndex, ...colHeaderProps }) => {
        return <ColHeader {...colHeaderProps} key={columnIndex} />
      }}
      renderRowsContainer={({ rowIndex, ...rowsContainerProps }) => {
        return <div {...rowsContainerProps} className="flex" key={rowIndex} />
      }}
      renderRowHeader={(rowHeaderProps) => {
        return <RowHeader {...rowHeaderProps} />
      }}
      renderCell={(cellProps) => {
        const { isFocused, hasSpreadsheetBeenFocused, row, col } = cellProps
        // if spreadsheet hasnt been focused yet, make the first cell tabIndex of 0
        // else set current focused cell tabIndex of 0
        const tabIndex = hasSpreadsheetBeenFocused
          ? isFocused
            ? 0
            : -1
          : row === 0 && col === 0
            ? 0
            : -1
        return (
          <SpreadsheetCell
            {...cellProps}
            key={cellProps.cell.id}
            tabIndex={tabIndex}
          />
        )
      }}
    />
  )
}
