import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { EntityMap } from './types'

interface Name {
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
    allIds: {},
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
        const nameRecord = action.payload
        state.nameRecords.byId[nameRecord.id] = nameRecord
        state.nameRecords.allIds[nameRecord.id] = nameRecord.id

        const searchInput = state.ui.searchInput

        // selected name to be new name record if it fits the search input
        if (
          nameRecord.name.includes(searchInput) ||
          nameRecord.surname.includes(searchInput)
        ) {
          state.ui.nameSelectedId = nameRecord.id
          state.ui.nameInput = nameRecord.name
          state.ui.surnameInput = nameRecord.surname
        }

        // Retrieve the currently selected name record from the state using the selected ID
        const currentSelectedNameRecord =
          state.nameRecords.byId[state.ui.nameSelectedId]
        // Check if the current selected name record exists and if either the name or surname
        // fits the new search input. If so, no need to change the selected name record
        if (
          currentSelectedNameRecord &&
          (currentSelectedNameRecord.name.includes(searchInput) ||
            currentSelectedNameRecord.surname.includes(searchInput))
        ) {
          return
        }

        state.ui.nameSelectedId = ''
        state.ui.nameInput = ''
        state.ui.surnameInput = ''
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

      const searchInput = state.ui.searchInput

      // Retrieve the currently selected name record from the state using the selected ID
      const currentSelectedNameRecord =
        state.nameRecords.byId[state.ui.nameSelectedId]
      // Check if the current selected name record exists and if either the name or surname
      // fits the new search input. If so, no need to change the selected name record
      if (
        currentSelectedNameRecord &&
        (currentSelectedNameRecord.name.includes(searchInput) ||
          currentSelectedNameRecord.surname.includes(searchInput))
      ) {
        return
      }

      // updates selected name record to the first on the list
      const newNameSelectedIndex = Object.values(state.nameRecords.allIds).find(
        (id) => {
          const nameRecord = state.nameRecords.byId[id]
          const { name, surname } = nameRecord

          return name.includes(searchInput) || surname.includes(searchInput)
        },
      )

      if (newNameSelectedIndex) {
        state.ui.nameSelectedId = newNameSelectedIndex
        state.ui.nameInput = state.nameRecords.byId[newNameSelectedIndex].name
        state.ui.surnameInput =
          state.nameRecords.byId[newNameSelectedIndex].surname
      } else {
        state.ui.nameSelectedId = ''
        state.ui.nameInput = ''
        state.ui.surnameInput = ''
      }
    },
    nameDeleted: (state, action: PayloadAction<string>) => {
      const idToDelete = action.payload
      delete state.nameRecords.byId[idToDelete]
      delete state.nameRecords.allIds[idToDelete]

      if (state.ui.nameSelectedId === idToDelete) {
        const searchInput = state.ui.searchInput

        // updates selected name record to the first on the list
        const newNameSelectedIndex = Object.values(
          state.nameRecords.allIds,
        ).find((id) => {
          const nameRecord = state.nameRecords.byId[id]
          const { name, surname } = nameRecord

          return name.includes(searchInput) || surname.includes(searchInput)
        })

        if (newNameSelectedIndex) {
          state.ui.nameSelectedId = newNameSelectedIndex
          state.ui.nameInput = state.nameRecords.byId[newNameSelectedIndex].name
          state.ui.surnameInput =
            state.nameRecords.byId[newNameSelectedIndex].surname
        } else {
          state.ui.nameSelectedId = ''
          state.ui.nameInput = ''
          state.ui.surnameInput = ''
        }
      }
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
      const newSearchInput = action.payload
      state.ui.searchInput = newSearchInput

      // Retrieve the currently selected name record from the state using the selected ID
      const currentSelectedNameRecord =
        state.nameRecords.byId[state.ui.nameSelectedId]
      // Check if the current selected name record exists and if either the name or surname
      // fits the new search input. If so, no need to change the selected name record
      if (
        currentSelectedNameRecord &&
        (currentSelectedNameRecord.name.includes(newSearchInput) ||
          currentSelectedNameRecord.surname.includes(newSearchInput))
      ) {
        return
      }

      // updates selected name record to the first on the list
      const newNameSelectedIndex = Object.values(state.nameRecords.allIds).find(
        (id) => {
          const nameRecord = state.nameRecords.byId[id]
          const { name, surname } = nameRecord

          return (
            name.includes(newSearchInput) || surname.includes(newSearchInput)
          )
        },
      )

      if (newNameSelectedIndex) {
        state.ui.nameSelectedId = newNameSelectedIndex
        state.ui.nameInput = state.nameRecords.byId[newNameSelectedIndex].name
        state.ui.surnameInput =
          state.nameRecords.byId[newNameSelectedIndex].surname
      } else {
        state.ui.nameSelectedId = ''
        state.ui.nameInput = ''
        state.ui.surnameInput = ''
      }
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
