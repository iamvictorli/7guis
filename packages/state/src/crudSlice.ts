import type { PayloadAction } from '@reduxjs/toolkit'

import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit'

import type { EntityMapOrdering } from './types'

interface Name {
  name: string
  surname: string
  id: string
}

export interface CRUDState {
  nameRecords: EntityMapOrdering<Name>
  ui: {
    nameInput: string
    surnameInput: string
    searchInput: string
    nameSelectedId: string
  }
}

export const initialState: CRUDState = {
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
}

/**
 * CRUD slice for managing a simple CRUD interface.
 *
 * Features:
 * - Supports adding, updating, and deleting name records.
 * - Implements real-time search filtering.
 * - Maintains UI state for selected and input values.
 */
const crudSlice = createSlice({
  name: 'crud',
  initialState,
  reducers: {
    nameCreated: {
      /**
       * Adds a new name record.
       * Updates the selected record if it matches the search criteria.
       */
      reducer: (state, action: PayloadAction<Name>) => {
        const nameRecord = action.payload
        state.nameRecords.byId[nameRecord.id] = nameRecord
        state.nameRecords.allIds.push(nameRecord.id)

        const searchInput = state.ui.searchInput

        // selected name to be new name record if it fits the search input
        if (
          nameRecord.name.includes(searchInput)
          || nameRecord.surname.includes(searchInput)
        ) {
          state.ui.nameSelectedId = nameRecord.id
          state.ui.nameInput = nameRecord.name
          state.ui.surnameInput = nameRecord.surname
        }

        // Retrieve the currently selected name record from the state using the selected ID
        const currentSelectedNameRecord
          = state.nameRecords.byId[state.ui.nameSelectedId]
        // Check if the current selected name record exists and if either the name or surname
        // fits the new search input. If so, no need to change the selected name record
        if (
          currentSelectedNameRecord
          && (currentSelectedNameRecord.name.includes(searchInput)
            || currentSelectedNameRecord.surname.includes(searchInput))
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

    /**
     * Updates an existing name record.
     * If the updated record no longer matches the search input, another record is selected.
     */
    nameUpdated: (state, action: PayloadAction<Name>) => {
      const name = action.payload
      if (state.nameRecords.byId[name.id]) {
        state.nameRecords.byId[name.id] = name
      }

      const searchInput = state.ui.searchInput

      // Retrieve the currently selected name record from the state using the selected ID
      const currentSelectedNameRecord
        = state.nameRecords.byId[state.ui.nameSelectedId]
      // Check if the current selected name record exists and if either the name or surname
      // fits the new search input. If so, no need to change the selected name record
      if (
        currentSelectedNameRecord
        && (currentSelectedNameRecord.name.includes(searchInput)
          || currentSelectedNameRecord.surname.includes(searchInput))
      ) {
        return
      }

      const newNameSelectedIndex = state.nameRecords.allIds.find((id) => {
        const nameRecord = state.nameRecords.byId[id]
        if (!nameRecord)
          return false
        const { name, surname } = nameRecord

        return name.includes(searchInput) || surname.includes(searchInput)
      })

      if (
        newNameSelectedIndex
        && state.nameRecords.byId[newNameSelectedIndex]
      ) {
        state.ui.nameSelectedId = newNameSelectedIndex
        state.ui.nameInput = state.nameRecords.byId[newNameSelectedIndex].name
        state.ui.surnameInput
          = state.nameRecords.byId[newNameSelectedIndex].surname
      }
      else {
        state.ui.nameSelectedId = ''
        state.ui.nameInput = ''
        state.ui.surnameInput = ''
      }
    },

    /**
     * Deletes a selected name record and updates the selection.
     */
    nameDeleted: (state, action: PayloadAction<string>) => {
      const idToDelete = action.payload
      delete state.nameRecords.byId[idToDelete]
      const index = state.nameRecords.allIds.findIndex(
        id => id === idToDelete,
      )

      if (index !== -1)
        state.nameRecords.allIds.splice(index, 1)

      if (state.ui.nameSelectedId === idToDelete) {
        const searchInput = state.ui.searchInput

        // updates selected name record to the first on the list
        const newNameSelectedIndex = state.nameRecords.allIds.find((id) => {
          const nameRecord = state.nameRecords.byId[id]
          if (!nameRecord)
            return false
          const { name, surname } = nameRecord

          return name.includes(searchInput) || surname.includes(searchInput)
        })

        if (
          newNameSelectedIndex
          && state.nameRecords.byId[newNameSelectedIndex]
        ) {
          state.ui.nameSelectedId = newNameSelectedIndex
          state.ui.nameInput = state.nameRecords.byId[newNameSelectedIndex].name
          state.ui.surnameInput
            = state.nameRecords.byId[newNameSelectedIndex].surname
        }
        else {
          state.ui.nameSelectedId = ''
          state.ui.nameInput = ''
          state.ui.surnameInput = ''
        }
      }
    },
    nameSelected: (state, action: PayloadAction<string>) => {
      const selectedNameRecord = state.nameRecords.byId[action.payload]
      // empty string to deselect
      if (action.payload === '' || !selectedNameRecord) {
        state.ui.nameInput = ''
        state.ui.surnameInput = ''
        state.ui.nameSelectedId = ''
      }
      else {
        state.ui.nameSelectedId = action.payload
        state.ui.nameInput = selectedNameRecord.name
        state.ui.surnameInput = selectedNameRecord.surname
      }
    },
    searchChanged: (state, action: PayloadAction<string>) => {
      const newSearchInput = action.payload
      state.ui.searchInput = newSearchInput

      // Retrieve the currently selected name record from the state using the selected ID
      const currentSelectedNameRecord
        = state.nameRecords.byId[state.ui.nameSelectedId]
      // Check if the current selected name record exists and if either the name or surname
      // fits the new search input. If so, no need to change the selected name record
      if (
        currentSelectedNameRecord
        && (currentSelectedNameRecord.name.includes(newSearchInput)
          || currentSelectedNameRecord.surname.includes(newSearchInput))
      ) {
        return
      }

      // updates selected name record to the first on the list
      const newNameSelectedIndex = state.nameRecords.allIds.find((id) => {
        const nameRecord = state.nameRecords.byId[id]
        if (!nameRecord)
          return false
        const { name, surname } = nameRecord

        return name.includes(newSearchInput) || surname.includes(newSearchInput)
      })

      if (
        newNameSelectedIndex
        && state.nameRecords.byId[newNameSelectedIndex]
      ) {
        state.ui.nameSelectedId = newNameSelectedIndex
        state.ui.nameInput = state.nameRecords.byId[newNameSelectedIndex].name
        state.ui.surnameInput
          = state.nameRecords.byId[newNameSelectedIndex].surname
      }
      else {
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
    selectNameRecords: state => state.nameRecords,
    selectUI: state => state.ui,
  },
})

export const { name, reducer } = crudSlice

const { actions, selectors } = crudSlice

export const {
  nameCreated,
  nameUpdated,
  nameDeleted,
  nameSelected,
  searchChanged,
  nameInputChanged,
  surnameInputChanged,
} = actions

export const { selectUI, selectNameRecords } = selectors
export const selectFilteredNameRecords = createSelector(
  [selectNameRecords, (_, searchInput: string) => searchInput],
  (nameRecords, searchInput) => {
    return Object.values(nameRecords.byId).filter((nameRecord) => {
      return (
        nameRecord.name.includes(searchInput)
        || nameRecord.surname.includes(searchInput)
      )
    })
  },
)
