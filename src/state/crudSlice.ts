import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { EntityMap } from './types'

interface Name {
  name: string
  surname: string
  id: string
}

interface CRUDState {
  names: EntityMap<Name>
  ui: {
    nameInput: string
    surnameInput: string
    prefixInput: string
    nameSelectedId: string
  }
}

const initialState: CRUDState = {
  names: {
    byId: {},
    allIds: [],
  },
  ui: {
    nameInput: '',
    surnameInput: '',
    prefixInput: '',
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
        state.names.byId[name.id] = name
        state.names.allIds.push(name.id)
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
      if (state.names.byId[name.id]) {
        state.names.byId[name.id] = name
      }
    },
    nameDeleted: (state, action: PayloadAction<string>) => {
      const idToDelete = action.payload
      delete state.names.byId[idToDelete]

      const index = state.names.allIds.findIndex((id) => id === idToDelete)
      if (index !== -1) state.names.allIds.splice(index, 1)

      // select first name of name list
      const newNameSelectedIndex = (state.ui.nameSelectedId =
        state.names.allIds.length > 0 ? state.names.allIds[0] : '')

      state.ui.nameInput =
        newNameSelectedIndex === ''
          ? ''
          : state.names.byId[newNameSelectedIndex].name
      state.ui.surnameInput =
        newNameSelectedIndex === ''
          ? ''
          : state.names.byId[newNameSelectedIndex].surname
      state.ui.nameSelectedId = newNameSelectedIndex
    },
    nameSelected: (state, action: PayloadAction<string>) => {
      state.ui.nameSelectedId = action.payload
      state.ui.nameInput = state.names.byId[action.payload].name
      state.ui.surnameInput = state.names.byId[action.payload].surname
    },
    prefixChanged: (state, action: PayloadAction<string>) => {
      state.ui.prefixInput = action.payload
    },
    nameInputChanged: (state, action: PayloadAction<string>) => {
      state.ui.nameInput = action.payload
    },
    surnameInputChanged: (state, action: PayloadAction<string>) => {
      state.ui.surnameInput = action.payload
    },
  },
  selectors: {
    selectNames: (state) => state.names,
    selectNameById: (state, id: string) => state.names.byId[id],
    selectUI: (state) => state.ui,
  },
})

export const { selectNameById, selectUI } = crudSlice.selectors

const { selectNames } = crudSlice.selectors

// createSelector to memoize selector when we use array operations like map and filter, which return new array references
// https://redux.js.org/usage/deriving-data-selectors#optimizing-selectors-with-memoization
export const selectFilteredNameIds = createSelector(
  [selectNames, (_, prefix: string) => prefix],
  (names, prefix) => {
    const nameIds = names.allIds
    return nameIds.filter((nameId) => {
      const name = names.byId[nameId]
      return name.name.includes(prefix) || name.surname.includes(prefix)
    })
  },
)

export const {
  nameCreated,
  nameUpdated,
  nameDeleted,
  nameSelected,
  prefixChanged,
  nameInputChanged,
  surnameInputChanged,
} = crudSlice.actions

export const CRUD_REDUCER_NAME = crudSlice.name

export default crudSlice.reducer
