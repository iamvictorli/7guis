import { useAppDispatch, useAppSelector } from '~/store'

import {
  cellChanged,
  cellInputChanged,
  cellSelected,
  selectCellIdRows,
  selectColumnLabels,
  selectInputValue,
  selectIsSelected,
} from 'state/cellsSlice'

function Cell({ id }: { id: string }) {
  const isSelected = useAppSelector(state => selectIsSelected(state, id))
  const inputValue = useAppSelector(state => selectInputValue(state, id))

  const dispatch = useAppDispatch()

  return (
    <td>
      <input
        className="p-4"
        readOnly={!isSelected}
        value={inputValue}
        onFocus={() => {
          dispatch(cellSelected(id))
        }}
        onChange={event => {
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
        onKeyUp={event => {
          // pressing enter while editting cell, updates cell and its children
          if (isSelected && ['Enter', 'Escape'].includes(event.key)) {
            dispatch(
              cellChanged({
                id,
                value: inputValue,
              }),
            )
          } else if (!isSelected && event.key === 'Enter') {
            // focus is still on the cell, but sets input readonly to false
            dispatch(cellSelected(id))
          }
        }}
      />
    </td>
  )
}

function Cells() {
  const columnLabels = useAppSelector(selectColumnLabels)
  const cellIdRows = useAppSelector(selectCellIdRows)

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th> </th>
            {columnLabels.map(columnLabel => (
              <th key={columnLabel}>{columnLabel}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cellIdRows.map((cellIdRow, index) => (
            <tr key={index}>
              <th>{index}</th>
              {cellIdRow.map(cellId => (
                <Cell key={cellId} id={cellId} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Cells
