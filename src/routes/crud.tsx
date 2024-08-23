import { useAppDispatch, useAppSelector } from '../store'
import {
  selectFilteredNameIds,
  selectNameById,
  selectUI,
  nameCreated,
  nameUpdated,
  nameDeleted,
  nameSelected,
  prefixChanged,
  nameInputChanged,
  surnameInputChanged,
} from '../state/crudSlice'

function Option({ id }: { id: string }) {
  const name = useAppSelector(state => selectNameById(state, id))
  return (
    <option key={id} value={id}>
      {`${name.surname}, ${name.name}`}
    </option>
  )
}

function Crud() {
  const dispatch = useAppDispatch()
  const { nameInput, surnameInput, prefixInput, nameSelectedId } =
    useAppSelector(selectUI)
  const filteredNameIds = useAppSelector(state =>
    selectFilteredNameIds(state, prefixInput),
  )
  return (
    <div>
      <span>Filter prefix:</span>
      <input
        value={prefixInput}
        onChange={event => {
          dispatch(prefixChanged(event.currentTarget.value))
        }}
      />
      <span>Name:</span>
      <input
        value={nameInput}
        onChange={event => {
          dispatch(nameInputChanged(event.currentTarget.value))
        }}
      />
      <span>Surname:</span>
      <input
        value={surnameInput}
        onChange={event => {
          dispatch(surnameInputChanged(event.currentTarget.value))
        }}
      />

      <select
        size={3}
        className="w-full mt-6 mb-4"
        onChange={event => {
          dispatch(nameSelected(event.currentTarget.value))
        }}
        value={nameSelectedId}>
        {filteredNameIds.map(nameId => (
          <Option key={nameId} id={nameId} />
        ))}
      </select>

      <button
        onClick={() => {
          dispatch(
            nameCreated({
              name: nameInput,
              surname: surnameInput,
            }),
          )
        }}>
        Create
      </button>
      <button
        onClick={() => {
          dispatch(
            nameUpdated({
              id: nameSelectedId,
              name: nameInput,
              surname: surnameInput,
            }),
          )
        }}>
        Update
      </button>
      <button
        onClick={() => {
          dispatch(nameDeleted(nameSelectedId))
        }}>
        Delete
      </button>
    </div>
  )
}

export default Crud
