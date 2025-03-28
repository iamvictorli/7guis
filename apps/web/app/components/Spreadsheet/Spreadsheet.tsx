import React, { useState } from 'react'

interface GridProps {
  role: 'grid'
  ['aria-label']: string
  ['aria-rowcount']: number
  ['aria-colcount']: number
  children: React.ReactNode
}
interface TopRowProps {
  role: 'row'
  children: React.ReactNode
}

interface CornerProps {
  role: 'gridcell'
  ['aria-readonly']: boolean
  ['aria-rowindex']: number
  ['aria-colindex']: number
}

export interface ColHeaderProps {
  role: 'columnheader'
  ['aria-readonly']: boolean
  ['aria-rowindex']: number
  ['aria-colindex']: number
  isFocusedCol: boolean
  columnLabel: string
  columnIndex: number
}

interface RowsContainerProps {
  role: 'row'
  rowIndex: number
  children: React.ReactNode
}

export interface RowHeaderProps {
  role: 'rowheader'
  ['aria-readonly']: boolean
  ['aria-colindex']: number
  ['aria-rowindex']: number
  isFocusedRow: boolean
  row: number
}

export interface CellProps<T> {
  cell: T
  row: number
  col: number
  isFocused: boolean
  onCellChange: (value: string) => void
  focusCell: (row: number, col: number) => void
  focusCurrentCell: () => void
  hasSpreadsheetBeenFocused: boolean
  dataLength: number
  columnLength: number
  ariaProps: {
    role: 'gridcell'
    ['aria-rowindex']: number
    ['aria-colindex']: number
    ['aria-selected']: boolean
  }
}

interface SpreadsheetProps<T> {
  /**
   * An array of records representing the spreadsheet cells.
   *
   * Keys of the record should be derived from columns string.
   */
  data: Record<string, T>[]

  /** Array of column header labels. */
  columns: string[]

  /** Accessible label for the spreadsheet. */
  label: string

  /** Callback function when a cell's value changes. */
  onCellChange: ({
    rowIndex,
    colIndex,
    value,
  }: {
    rowIndex: number
    colIndex: number
    value: string
  }) => void

  /** Render prop for grid container */
  renderGridContainer: (gridProps: GridProps) => React.ReactNode

  /** Render prop for top row container. */
  renderTopRowContainer: (topRowProps: TopRowProps) => React.ReactNode

  /** Render prop for top left container. */
  renderTopLeftCorner: (cornerProps: CornerProps) => React.ReactNode

  /** Render prop for column header. */
  renderColHeader: (colHeaderProps: ColHeaderProps) => React.ReactNode

  /** Render prop for the row container. */
  renderRowsContainer: (
    rowsContainerProps: RowsContainerProps,
  ) => React.ReactNode

  /** Render prop for the row header. */
  renderRowHeader: (rowHeaderProps: RowHeaderProps) => React.ReactNode

  /** Render props for an individual cell */
  renderCell: (cellProps: CellProps<T>) => React.ReactNode
}

/**
 * Spreadsheet Component
 *
 * A customizable and accessible grid component for displaying and editing tabular data.
 * It delegates the rendering of specific areas (such as headers, cells, and containers)
 * to custom render functions provided via props.
 *
 */
export default function Spreadsheet<T>({
  data,
  columns,
  label,
  onCellChange,
  renderGridContainer,
  renderTopRowContainer,
  renderTopLeftCorner,
  renderColHeader,
  renderRowsContainer,
  renderRowHeader,
  renderCell,
}: SpreadsheetProps<T>) {
  // State for the currently focused cell
  const [focusedCell, setFocusedCell] = useState<{
    row: number
    col: number
  } | null>(null)

  // Render the grid
  return renderGridContainer({
    'role': 'grid',
    'aria-label': label,
    'aria-rowcount': data.length + 1, // +1 to include header row
    'aria-colcount': columns.length + 1, // +1 to include header column
    'children': (
      <>
        {/* Render first row with column names */}
        {renderTopRowContainer({
          role: 'row',
          children: (
            <>
              {/* Top-left corner cell (empty) */}
              {renderTopLeftCorner({
                'role': 'gridcell',
                'aria-readonly': true,
                'aria-rowindex': 1,
                'aria-colindex': 1,
              })}

              {columns.map((column, columnIndex) =>
                renderColHeader({
                  'role': 'columnheader',
                  'aria-readonly': true,
                  'aria-rowindex': 1,
                  'aria-colindex': columnIndex + 2, // adding 2, +1 b/c of 0 based, +1 for the top left corner cell
                  'isFocusedCol': focusedCell?.col === columnIndex,
                  'columnLabel': column,
                  columnIndex,
                }),
              )}
            </>
          ),
        })}

        {/* Render rows */}
        {data.map((dataRow, rowIndex) =>
          renderRowsContainer({
            role: 'row',
            rowIndex,
            children: (
              <>
                {renderRowHeader({
                  'role': 'rowheader',
                  'aria-readonly': true,
                  'aria-colindex': 1,
                  'aria-rowindex': rowIndex + 2, // adding 2, +1 b/c 0 based, +1 from column header row
                  'isFocusedRow': focusedCell?.row === rowIndex,
                  'row': rowIndex + 1, // must be 1 based row headers
                })}

                {/* Render cells */}
                {columns.map((column, colIndex) => {
                  const cell = dataRow[column]
                  if (!cell) {
                    throw new Error(
                      `Key ${column} does not exist in row index ${rowIndex}`,
                    )
                  }
                  const isFocused = !!(
                    focusedCell
                    && focusedCell.row === rowIndex
                    && focusedCell.col === colIndex
                  )
                  const focusCell = (row: number, col: number) => {
                    setFocusedCell({ row, col })
                  }
                  const focusCurrentCell = () => {
                    setFocusedCell({ row: rowIndex, col: colIndex })
                  }
                  const hasSpreadsheetBeenFocused = !!focusedCell
                  const ariaProps = {
                    'role': 'gridcell' as const,
                    'aria-rowindex': rowIndex + 2, // adding 2, for 0 based and column header row
                    'aria-colindex': colIndex + 2, // adding 2, for 0 based and extra column for row header
                    'aria-selected': isFocused,
                  }
                  return renderCell({
                    cell,
                    row: rowIndex,
                    col: colIndex,
                    isFocused,
                    onCellChange: (value: string) =>
                      onCellChange({ rowIndex, colIndex, value }),
                    focusCell,
                    focusCurrentCell,
                    hasSpreadsheetBeenFocused,
                    dataLength: data.length,
                    columnLength: columns.length,
                    ariaProps,
                  })
                })}
              </>
            ),
          }),
        )}
      </>
    ),
  })
}
