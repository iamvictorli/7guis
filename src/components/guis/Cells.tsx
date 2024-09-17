import { useAppDispatch, useAppSelector } from '~/store'

import {
  cellChanged,
  cellInputChanged,
  cellSelected,
  selectCellRows,
  selectColumnLabels,
  selectInputValue,
  selectIsSelected,
} from 'state/cellsSlice'
import SpreadSheet from 'components/Spreadsheet/SpreadSheet'

function Cell({ id }: { id: string }) {
  const isSelected = useAppSelector((state) => selectIsSelected(state, id))
  const inputValue = useAppSelector((state) => selectInputValue(state, id))

  const dispatch = useAppDispatch()

  return (
    <td>
      <input
        className="p-4"
        // readOnly https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly
        // readOnly is false means the cell is on edit mode
        readOnly={!isSelected}
        value={inputValue}
        onFocus={() => {
          dispatch(cellSelected(id))
        }}
        onChange={(event) => {
          dispatch(cellInputChanged(event.currentTarget.value))
        }}
        onBlur={() => {
          if (isSelected) {
            dispatch(
              cellChanged({
                id,
                value: inputValue,
              }),
            )
          }
        }}
        onKeyUp={(event) => {
          // pressing enter or escape while editting cell, updates cell and its children
          if (isSelected && ['Enter', 'Escape'].includes(event.key)) {
            dispatch(
              cellChanged({
                id,
                value: inputValue,
              }),
            )
          } else if (!isSelected && event.key === 'Enter') {
            // for when accessibility focus is on cell, but not in "edit mode" for cell
            // selects cell when pressing Enter and puts in "edit mode"
            dispatch(cellSelected(id))
          }
        }}
      />
    </td>
  )
}

export default function Cells() {
  const columnLabels = useAppSelector(selectColumnLabels)
  const cellRows = useAppSelector(selectCellRows)

  return (
    <>
      <SpreadSheet />
      {/* <table>
        <thead>
          <tr>
            <th> </th>
            {columnLabels.map((columnLabel) => (
              <th key={columnLabel}>{columnLabel}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cellIdRows.map((cellIdRow, index) => (
            <tr key={index}>
              <th>{index}</th>
              {cellIdRow.map((cellId) => (
                <Cell key={cellId} id={cellId} />
              ))}
            </tr>
          ))}
        </tbody>
      </table> */}
    </>
  )
}
