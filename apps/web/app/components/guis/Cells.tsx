import type { InputHTMLAttributes, KeyboardEvent } from 'react'

import React, { memo, useEffect, useRef, useState } from 'react'

import type { Cell } from '@7gui/state/cellsSlice'
import type {
  CellProps,
  ColHeaderProps,
  RowHeaderProps,
} from '~/components/Spreadsheet/Spreadsheet'

import {
  cellChanged,
  selectCellMatrix,
  selectColumnLabels,
} from '@7gui/state/cellsSlice'
import SpreadSheet from '~/components/Spreadsheet/Spreadsheet'
import { cn } from '~/lib/utils'
import { useAppDispatch, useAppSelector } from '~/store'

/**
 * CellInput component that automatically focuses when rendered.
 */
function CellInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])
  return <input {...props} ref={inputRef} />
}

/**
 * Row header with styling indicating focus.
 */
const RowHeader = memo(({
  isFocusedRow,
  row,
  ...props
}: RowHeaderProps) => {
  return (
    <div
      {...props}
      className={cn(
        'flex h-8 w-16 items-center justify-center border border-[var(--gray-a6)]',
        isFocusedRow ? 'bg-[var(--accent-a5)]' : 'bg-[var(--gray-a2)]',
      )}
    >
      {row}
    </div>
  )
})

/**
 * Column Header with styles indicating focus.
 */
const ColHeader = memo(({
  isFocusedCol,
  columnLabel,
  ...props
}: Omit<ColHeaderProps, 'columnIndex'>) => {
  return (
    <div
      {...props}
      className={cn(
        'flex h-8 w-16 items-center justify-center border border-[var(--gray-a6)]',
        isFocusedCol ? 'bg-[var(--accent-a5)]' : 'bg-[var(--gray-a2)]',
      )}
    >
      {columnLabel}
    </div>
  )
})

/**
 * SpreadsheetCell Component
 *
 * Manages focus, edit mode, and keyboard navigation for a single spreadsheet cell.
 */
const SpreadsheetCell = memo(
  ({
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
  }: CellProps<Cell> & { tabIndex?: number }) => {
    const [inputValue, setInputValue] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const ref = useRef<HTMLDivElement | null>(null)

    // Focus the cell if it is focused and not in edit mode.
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

    function exitEditMode() {
      setIsEditing(false)
    }

    function enterEditMode() {
      setIsEditing(true)
    }

    function cancelEditMode() {
      if (isEditing) {
        setIsEditing(false)
      }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      setInputValue(e.target.value)
    }

    /**
     * Handles keyboard interactions for cell navigation and editing.
     */
    function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
      if (e.key === 'Enter' || e.key === 'F2') {
        if (isEditing) {
          cellChange()

          // If already in edit mode, exit and move focus down
          exitEditMode()
          if (row + 1 < dataLength) {
            focusCell(row + 1, col)
          }
        }
        else {
          // Enter edit mode
          setInputValue(cell.formula ?? cell.computedValue ?? '')
          enterEditMode()
        }
      }
      else if (e.key === 'Escape') {
        cancelEditMode()
      }
      else if (e.key === 'ArrowRight' && !isEditing && col + 1 < columnLength) {
        // Move focus right
        focusCell(row, col + 1)
      }
      else if (e.key === 'ArrowLeft' && !isEditing && col - 1 >= 0) {
        // Move focus left
        focusCell(row, col - 1)
      }
      else if (e.key === 'ArrowDown' && !isEditing && row + 1 < dataLength) {
        // Move focus down
        focusCell(row + 1, col)
      }
      else if (e.key === 'ArrowUp' && !isEditing && row - 1 >= 0) {
        // Move focus up
        focusCell(row - 1, col)
      }
      else if (e.key === 'Tab' && isEditing) {
        e.preventDefault()
        exitEditMode()
        cellChange()
        // Move focus to next or previous cell
        let nextRow = row
        let nextCol = col + (e.shiftKey ? -1 : 1)

        // Handle wrapping to next/previous row
        if (nextCol >= columnLength) {
          nextCol = 0
          nextRow = row + 1
        }
        else if (nextCol < 0) {
          nextCol = columnLength - 1
          nextRow = row - 1
        }

        // Check bounds and update focusedCell
        if (nextRow >= 0 && nextRow < dataLength) {
          focusCell(nextRow, nextCol)
        }
      }
    }

    return (
      <div
        {...ariaProps}
        role="textbox"
        tabIndex={tabIndex}
        ref={ref}
        className={cn(
          'flex h-8 w-16 items-center justify-center border focus:outline-1 focus:outline-[var(--focus-10)]',
          isFocused ? 'border-[var(--accent-a9)]' : 'border-[var(--gray-a6)]',
        )}
        onFocus={focusCurrentCell}
        onKeyDown={handleKeyDown}
        onClick={focusCurrentCell}
        onDoubleClick={enterEditMode}
      >
        {isEditing
          ? (
              <CellInput
                id={`input-${cell.id}`}
                type="text"
                className="focus:outline-hidden size-full"
                value={inputValue}
                onChange={handleChange}
                onBlur={() => {
                  cellChange()
                  exitEditMode()
                }}
              />
            )
          : (
              cell.computedValue
            )}
      </div>
    )
  },
  (prevProps, nextProps) => {
    // Re-render if isFocused changes
    if (prevProps.isFocused !== nextProps.isFocused)
      return false

    // Re-render if the cells computedValue has changed
    if (prevProps.cell.computedValue !== nextProps.cell.computedValue)
      return false

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
      renderGridContainer={gridProps => (
        <div {...gridProps} className="inline-block rounded-[var(--radius-1)] border border-solid border-[var(--gray-a6)]" />
      )}
      renderTopRowContainer={topRowProps => <div {...topRowProps} className="flex" />}
      renderTopLeftCorner={cornerProps => (
        <div {...cornerProps} className="h-8 w-16 border border-[var(--gray-a6)] bg-[var(--gray-a2)]" />
      )}
      renderColHeader={({ columnIndex, ...colHeaderProps }) => <ColHeader {...colHeaderProps} key={columnIndex} />}
      renderRowsContainer={({ rowIndex, ...rowsContainerProps }) => <div {...rowsContainerProps} className="flex" key={rowIndex} />}
      renderRowHeader={rowHeaderProps => <RowHeader {...rowHeaderProps} />}
      renderCell={(cellProps) => {
        const { isFocused, row, col, hasSpreadsheetBeenFocused } = cellProps
        // if spreadsheet hasnt been focused yet, make the first cell tabIndex of 0
        // else set current focused cell tabIndex of 0
        const tabIndex = hasSpreadsheetBeenFocused
          ? isFocused ? 0 : -1
          : row === 0 && col === 0 ? 0 : -1
        return (
          <SpreadsheetCell {...cellProps} key={cellProps.cell.id} tabIndex={tabIndex} />
        )
      }}
    />
  )
}
