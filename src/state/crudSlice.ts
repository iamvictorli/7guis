import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { EntityMap } from './types'

export interface Name {
  name: string
  surname: string
  id: string
}

interface CRUDState {
  nameRecords: EntityMap<Name>
  ui: {
    nameInput: string
    surnameInput: string
    searchInput: string
    nameSelectedId: string
  }
}

const initialState: CRUDState = {
  nameRecords: {
    byId: {},
    allIds: [],
  },
  ui: {
    nameInput: '',
    surnameInput: '',
    searchInput: '',
    nameSelectedId: '',
  },
} satisfies CRUDState as CRUDState

const crudSlice = createSlice({
  name: 'crud',
  initialState,
  reducers: {
    nameCreated: {
      reducer: (state, action: PayloadAction<Name>) => {
        const name = action.payload
        state.nameRecords.byId[name.id] = name
        state.nameRecords.allIds.push(name.id)
        state.ui.nameSelectedId = name.id
      },
      // prepare to generate ids
      prepare: (nameProps: Omit<Name, 'id'>) => {
        const id = nanoid()
        return {
          payload: {
            id,
            ...nameProps,
          },
        }
      },
    },
    nameUpdated: (state, action: PayloadAction<Name>) => {
      const name = action.payload
      if (state.nameRecords.byId[name.id]) {
        state.nameRecords.byId[name.id] = name
      }
    },
    nameDeleted: (state, action: PayloadAction<string>) => {
      const idToDelete = action.payload
      delete state.nameRecords.byId[idToDelete]

      const index = state.nameRecords.allIds.findIndex(
        (id) => id === idToDelete,
      )
      if (index !== -1) state.nameRecords.allIds.splice(index, 1)

      // select first name of name list
      const newNameSelectedIndex = (state.ui.nameSelectedId =
        state.nameRecords.allIds.length > 0 ? state.nameRecords.allIds[0] : '')

      state.ui.nameInput =
        newNameSelectedIndex === ''
          ? ''
          : state.nameRecords.byId[newNameSelectedIndex].name
      state.ui.surnameInput =
        newNameSelectedIndex === ''
          ? ''
          : state.nameRecords.byId[newNameSelectedIndex].surname
      state.ui.nameSelectedId = newNameSelectedIndex
    },
    nameSelected: (state, action: PayloadAction<string>) => {
      state.ui.nameSelectedId = action.payload
      // empty string to deselect
      if (action.payload === '') {
        state.ui.nameInput = ''
        state.ui.surnameInput = ''
      } else {
        state.ui.nameInput = state.nameRecords.byId[action.payload].name
        state.ui.surnameInput = state.nameRecords.byId[action.payload].surname
      }
    },
    searchChanged: (state, action: PayloadAction<string>) => {
      state.ui.searchInput = action.payload
    },
    nameInputChanged: (state, action: PayloadAction<string>) => {
      state.ui.nameInput = action.payload
    },
    surnameInputChanged: (state, action: PayloadAction<string>) => {
      state.ui.surnameInput = action.payload
    },
  },
  selectors: {
    selectNameRecords: (state) => state.nameRecords,
    selectUI: (state) => state.ui,
  },
})

export const { selectUI } = crudSlice.selectors

const { selectNameRecords } = crudSlice.selectors

export const selectFilteredNameRecords = createSelector(
  [selectNameRecords, selectUI],
  (nameRecords, { searchInput }) => {
    return Object.values(nameRecords.byId).filter((nameRecord) => {
      return (
        nameRecord.name.includes(searchInput) ||
        nameRecord.surname.includes(searchInput)
      )
    })
  },
)

export const {
  nameCreated,
  nameUpdated,
  nameDeleted,
  nameSelected,
  searchChanged,
  nameInputChanged,
  surnameInputChanged,
} = crudSlice.actions

export const CRUD_REDUCER_NAME = crudSlice.name

export default crudSlice.reducer
