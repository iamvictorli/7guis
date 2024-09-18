import SpreadSheet from '~/components/Spreadsheet/Spreadsheet'
import { useAppDispatch, useAppSelector } from '~/store'

import {
  cellChanged,
  selectCellMatrix,
  selectColumnLabels,
} from 'state/cellsSlice'

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
    />
  )
}
