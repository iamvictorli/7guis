import { describe, expect, it } from 'vitest'

import type {
  CRUDState,
} from './crudSlice'

import {
  initialState,
  name,
  nameCreated,
  nameDeleted,
  nameInputChanged,
  nameSelected,
  nameUpdated,
  reducer,
  searchChanged,
  selectFilteredNameRecords,
  selectNameRecords,
  selectUI,
  surnameInputChanged,
} from './crudSlice'

describe('crudSlice', () => {
  describe('nameCreated', () => {
    it('should create a new record and update UI when search input matches the record', () => {
      // set a search string that will match the new record
      const stateWithSearch: CRUDState = {
        ...initialState,
        ui: { ...initialState.ui, searchInput: 'John' },
      }
      // dispatch nameCreated action
      const action = nameCreated({ name: 'John', surname: 'Doe' })
      const state = reducer(stateWithSearch, action)
      const newId = action.payload.id

      const nameRecords = selectNameRecords({ [name]: state })
      // verify record is added in byId and allIds
      expect(nameRecords.byId[newId]).toEqual({ id: newId, name: 'John', surname: 'Doe' })
      expect(nameRecords.allIds).toContain(newId)
      expect(nameRecords.allIds).toHaveLength(1)
      // because the search input "John" matches, the UI should reflect the new record
      expect(selectUI({ [name]: state })).toEqual({
        nameInput: 'John',
        surnameInput: 'Doe',
        searchInput: 'John',
        nameSelectedId: newId,
      })
    })

    it('should create a new record and reset UI when search input does not match the record', () => {
      const stateWithSearch: CRUDState = {
        ...initialState,
        ui: { ...initialState.ui, searchInput: 'XYZ' },
      }
      const action = nameCreated({ name: 'Alice', surname: 'Smith' })
      const state = reducer(stateWithSearch, action)
      const newId = action.payload.id

      const nameRecords = selectNameRecords({ [name]: state })
      // verify record is added in byId and allIds
      expect(nameRecords.byId[newId]).toEqual({ id: newId, name: 'Alice', surname: 'Smith' })
      expect(nameRecords.allIds).toContain(newId)
      expect(nameRecords.allIds).toHaveLength(1)

      // since neither "Alice" nor "Smith" includes "XYZ", UI is reset to empty strings
      expect(selectUI({ [name]: state })).toEqual({
        nameInput: '',
        surnameInput: '',
        searchInput: 'XYZ',
        nameSelectedId: '',
      })
    })

    it('should update UI correctly when search input is empty (thus matching every record)', () => {
      const stateWithEmptySearch = initialState
      let action = nameCreated({ name: 'Bob', surname: 'Marley' })
      let state = reducer(stateWithEmptySearch, action)
      let newId = action.payload.id

      let nameRecords = selectNameRecords({ [name]: state })
      // verify record is added in byId and allIds
      expect(nameRecords.byId[newId]).toEqual({ id: newId, name: 'Bob', surname: 'Marley' })
      expect(nameRecords.allIds).toContain(newId)
      expect(nameRecords.allIds).toHaveLength(1)

      // empty search string always matches, so UI reflects the new record
      expect(selectUI({ [name]: state })).toEqual({
        nameInput: 'Bob',
        surnameInput: 'Marley',
        searchInput: '',
        nameSelectedId: newId,
      })

      // create another name
      action = nameCreated({ name: 'John', surname: 'Doe' })
      state = reducer(state, action)
      newId = action.payload.id

      nameRecords = selectNameRecords({ [name]: state })
      // verify record is added in byId and allIds
      expect(nameRecords.byId[newId]).toEqual({ id: newId, name: 'John', surname: 'Doe' })
      expect(nameRecords.allIds).toContain(newId)
      expect(nameRecords.allIds).toHaveLength(2)

      // empty search string always matches, so UI reflects the new record
      expect(selectUI({ [name]: state })).toEqual({
        nameInput: 'John',
        surnameInput: 'Doe',
        searchInput: '',
        nameSelectedId: newId,
      })
    })
  })

  describe('nameUpdated', () => {
    it('should update an existing record and keep UI unchanged if the record still matches the search', () => {
      const id = 'test-id'
      const startingState: CRUDState = {
        nameRecords: {
          byId: { [id]: { id, name: 'Alice', surname: 'Wonderland' } },
          allIds: [id],
        },
        ui: {
          nameInput: 'Alice',
          surnameInput: 'Wonderland',
          searchInput: 'Alice',
          nameSelectedId: id,
        },
      }

      const newSurname = 'Smith'
      // simulate surname change
      let state = reducer(startingState, surnameInputChanged('Smith'))

      // update the record but keep "Alice" so that the search "Alice" still matches
      const updatedRecord = { id, name: 'Alice', surname: newSurname }
      state = reducer(state, nameUpdated(updatedRecord))

      const nameRecords = selectNameRecords({ [name]: state })
      expect(nameRecords.byId[id]).toEqual(updatedRecord)
      expect(nameRecords.allIds).toContain(id)
      expect(nameRecords.allIds).toHaveLength(1)
      // UI remains unchanged
      expect(selectUI({ [name]: state })).toEqual({
        nameInput: 'Alice',
        surnameInput: newSurname,
        searchInput: 'Alice',
        nameSelectedId: id,
      })
    })

    it('should update an existing record and change UI to a matching record when the selected record no longer matches', () => {
      // Set up two records. Initially, record1 is selected but does not match the new search after update.
      const id1 = 'id1'
      const id2 = 'id2'
      const id3 = 'id3'
      const startingState: CRUDState = {
        nameRecords: {
          byId: {
            [id1]: { id: id1, name: 'Bob', surname: 'Builder' },
            [id2]: { id: id2, name: 'Samantha', surname: 'Jones' },
            [id3]: { id: id3, name: 'Bobby', surname: 'Lee' },
          },
          allIds: [id1, id2, id3],
        },
        ui: {
          nameInput: 'Bob',
          surnameInput: 'Builder',
          searchInput: 'Bob',
          nameSelectedId: id1,
        },
      }

      const newName = 'Robert'
      // simulate name change
      let state = reducer(startingState, nameInputChanged(newName))

      // update record1 so it no longer contains "Sam"
      const updatedRecord1 = { id: id1, name: newName, surname: 'Builder' }
      state = reducer(state, nameUpdated(updatedRecord1))
      // Since record1 no longer matches the search ("Bob"), the UI should update to record3.
      const nameRecords = selectNameRecords({ [name]: state })
      expect(nameRecords.byId[id1]).toEqual(updatedRecord1)
      expect(nameRecords.allIds).toContain(id1)
      expect(nameRecords.allIds).toHaveLength(3)

      expect(selectUI({ [name]: state })).toEqual({
        nameInput: 'Bobby',
        surnameInput: 'Lee',
        searchInput: 'Bob',
        nameSelectedId: id3,
      })
    })

    it('should reset UI if no record matches the search after an update', () => {
      const id = 'id1'
      const startingState: CRUDState = {
        nameRecords: {
          byId: { [id]: { id, name: 'Claire', surname: 'Brown' } },
          allIds: [id],
        },
        ui: {
          nameInput: 'Claire',
          surnameInput: 'Brown',
          searchInput: 'Cla',
          nameSelectedId: id,
        },
      }

      const newName = 'Charlie'
      // simulate name change
      let state = reducer(startingState, nameInputChanged(newName))

      const updatedRecord = { id, name: newName, surname: 'Brown' }
      state = reducer(state, nameUpdated(updatedRecord))
      const nameRecords = selectNameRecords({ [name]: state })
      expect(nameRecords.byId[id]).toEqual(updatedRecord)
      expect(nameRecords.allIds).toContain(id)
      expect(nameRecords.allIds).toHaveLength(1)

      expect(selectUI({ [name]: state })).toEqual({
        nameInput: '',
        surnameInput: '',
        searchInput: 'Cla',
        nameSelectedId: '',
      })
    })

    it('should do nothing if updating a non-existent record', () => {
      const startingState = initialState
      const updatedRecord = { id: 'non-existent', name: 'No', surname: 'Body' }
      const state = reducer(startingState, nameUpdated(updatedRecord))
      // the state should remain unchanged
      expect(state).toEqual(startingState)
    })
  })

  describe('nameDeleted', () => {
    it('should reset UI selection if the deleted record was selected and no other record matches the search', () => {
      const id = 'id1'
      const startingState: CRUDState = {
        nameRecords: {
          byId: { [id]: { id, name: 'Alice', surname: 'Wonder' } },
          allIds: [id],
        },
        ui: {
          nameInput: 'Alice',
          surnameInput: 'Wonder',
          searchInput: '',
          nameSelectedId: id,
        },
      }
      const state = reducer(startingState, nameDeleted(id))
      const nameRecords = selectNameRecords({ [name]: state })
      expect(nameRecords.byId).not.toHaveProperty(id)
      expect(nameRecords.allIds).not.toContain(id)
      expect(nameRecords.allIds).toHaveLength(0)
      expect(selectUI({ [name]: state })).toEqual({
        nameInput: '',
        surnameInput: '',
        searchInput: '',
        nameSelectedId: '',
      })
    })

    it('should update UI selection if the deleted record was selected and another record matches the search', () => {
      const id1 = 'id1'
      const id2 = 'id2'
      const id3 = 'id3'
      const startingState: CRUDState = {
        nameRecords: {
          byId: {
            [id1]: { id: id1, name: 'Bob', surname: 'Marley' },
            [id2]: { id: id2, name: 'Sam', surname: 'Smith' },
            [id3]: { id: id3, name: 'Bobby', surname: 'Lee' },
          },
          allIds: [id1, id2, id3],
        },
        ui: {
          nameInput: 'Bob',
          surnameInput: 'Marley',
          searchInput: 'Bob',
          nameSelectedId: id1,
        },
      }
      const state = reducer(startingState, nameDeleted(id1))
      const nameRecords = selectNameRecords({ [name]: state })

      expect(nameRecords.byId).not.toHaveProperty(id1)
      expect(nameRecords.allIds).not.toContain(id1)
      expect(nameRecords.allIds).toHaveLength(2)

      // UI should now select record id3 as it matches "Bob"
      expect(selectUI({ [name]: state })).toEqual({
        nameInput: 'Bobby',
        surnameInput: 'Lee',
        searchInput: 'Bob',
        nameSelectedId: id3,
      })
    })

    it('should not change UI if the deleted record was not selected', () => {
      const id1 = 'id1'
      const id2 = 'id2'
      const startingState: CRUDState = {
        nameRecords: {
          byId: {
            [id1]: { id: id1, name: 'Alice', surname: 'Wonder' },
            [id2]: { id: id2, name: 'Bob', surname: 'Builder' },
          },
          allIds: [id1, id2],
        },
        ui: {
          nameInput: 'Alice',
          surnameInput: 'Wonder',
          searchInput: '',
          nameSelectedId: id1,
        },
      }
      const state = reducer(startingState, nameDeleted(id2))
      const nameRecords = selectNameRecords({ [name]: state })
      expect(nameRecords.byId).not.toHaveProperty(id2)
      expect(nameRecords.allIds).not.toContain(id2)
      expect(nameRecords.allIds).toHaveLength(1)

      expect(selectUI({ [name]: state })).toEqual({
        nameInput: 'Alice',
        surnameInput: 'Wonder',
        searchInput: '',
        nameSelectedId: id1,
      })
    })
  })

  describe('nameSelected', () => {
    it('should update UI fields when a valid record is selected', () => {
      const id = 'id1'
      const record = { id, name: 'Diana', surname: 'Prince' }
      const startingState: CRUDState = {
        nameRecords: {
          byId: { [id]: record },
          allIds: [id],
        },
        ui: { ...initialState.ui },
      }
      const state = reducer(startingState, nameSelected(id))
      expect(selectUI({ [name]: state })).toEqual({
        nameInput: 'Diana',
        surnameInput: 'Prince',
        searchInput: '',
        nameSelectedId: id,
      })
    })

    it('should clear UI fields when an empty string is selected', () => {
      const id = 'id1'
      const record = { id, name: 'Diana', surname: 'Prince' }
      const startingState: CRUDState = {
        nameRecords: {
          byId: { [id]: record },
          allIds: [id],
        },
        ui: { ...initialState.ui },
      }
      const state = reducer(startingState, nameSelected(''))
      expect(selectUI({ [name]: state })).toEqual({
        nameInput: '',
        surnameInput: '',
        searchInput: '',
        nameSelectedId: '',
      })
    })

    it('should clear UI fields when a non-existent record is selected', () => {
      const startingState: CRUDState = {
        ...initialState,
        ui: {
          nameInput: 'Old',
          surnameInput: 'Data',
          searchInput: 'blah',
          nameSelectedId: '',
        },
      }
      const state = reducer(startingState, nameSelected('non-existent'))
      expect(selectUI({ [name]: state })).toEqual({
        nameInput: '',
        surnameInput: '',
        searchInput: 'blah',
        nameSelectedId: '',
      })
    })
  })

  describe('searchChanged', () => {
    it('should update search input and select the first matching record when the current selection no longer matches', () => {
      const id1 = 'id1'
      const id2 = 'id2'
      const startingState: CRUDState = {
        nameRecords: {
          byId: {
            [id1]: { id: id1, name: 'Alice', surname: 'Wonder' },
            [id2]: { id: id2, name: 'Bob', surname: 'Builder' },
          },
          allIds: [id1, id2],
        },
        ui: {
          nameInput: 'Alice',
          surnameInput: 'Wonder',
          searchInput: 'Ali',
          nameSelectedId: id1,
        },
      }
      // Change search input so that "Alice" no longer matches and "Bob" becomes the first match
      const state = reducer(startingState, searchChanged('Bob'))
      expect(selectUI({ [name]: state })).toEqual({
        nameInput: 'Bob',
        surnameInput: 'Builder',
        searchInput: 'Bob',
        nameSelectedId: id2,
      })
    })

    it('should not change UI selection if the current selected record still matches the new search', () => {
      const id1 = 'id1'
      const startingState: CRUDState = {
        nameRecords: {
          byId: { [id1]: { id: id1, name: 'Alice', surname: 'Wonder' } },
          allIds: [id1],
        },
        ui: {
          nameInput: 'Alice',
          surnameInput: 'Wonder',
          searchInput: 'Alice',
          nameSelectedId: id1,
        },
      }
      const state = reducer(startingState, searchChanged('Al'))
      expect(selectUI({ [name]: state })).toEqual({
        nameInput: 'Alice',
        surnameInput: 'Wonder',
        searchInput: 'Al',
        nameSelectedId: id1,
      })
    })

    it('should clear UI selection if no record matches the new search', () => {
      const id1 = 'id1'
      const startingState: CRUDState = {
        nameRecords: {
          byId: { [id1]: { id: id1, name: 'Alice', surname: 'Wonder' } },
          allIds: [id1],
        },
        ui: {
          nameInput: 'Alice',
          surnameInput: 'Wonder',
          searchInput: 'Ali',
          nameSelectedId: id1,
        },
      }
      const state = reducer(startingState, searchChanged('Z'))
      expect(selectUI({ [name]: state })).toEqual({
        nameInput: '',
        surnameInput: '',
        searchInput: 'Z',
        nameSelectedId: '',
      })
    })
  })

  describe('nameInputChanged and surnameInputChanged', () => {
    it('should update nameInput when nameInputChanged is dispatched', () => {
      const state = reducer(initialState, nameInputChanged('New Name'))
      expect(selectUI({ [name]: state })).toEqual({
        nameInput: 'New Name',
        surnameInput: '',
        searchInput: '',
        nameSelectedId: '',
      })
    })

    it('should update surnameInput when surnameInputChanged is dispatched', () => {
      const state = reducer(initialState, surnameInputChanged('New Surname'))
      expect(selectUI({ [name]: state })).toEqual({
        nameInput: '',
        surnameInput: 'New Surname',
        searchInput: '',
        nameSelectedId: '',
      })
    })
  })

  describe('selectFilteredNameRecords selector', () => {
    it('should return records that match the search input', () => {
      const id1 = 'id1'
      const id2 = 'id2'
      const state: CRUDState = {
        nameRecords: {
          byId: {
            [id1]: { id: id1, name: 'Alice', surname: 'Wonder' },
            [id2]: { id: id2, name: 'Bob', surname: 'Builder' },
          },
          allIds: [id1, id2],
        },
        ui: { ...initialState.ui, searchInput: 'A' },
      }
      const filtered = selectFilteredNameRecords({ [name]: state }, 'A')
      expect(filtered).toEqual([{ id: id1, name: 'Alice', surname: 'Wonder' }])
    })

    it('should return all records when search input is empty', () => {
      const id1 = 'id1'
      const id2 = 'id2'
      const state = {
        ...initialState,
        nameRecords: {
          byId: {
            [id1]: { id: id1, name: 'Alice', surname: 'Wonder' },
            [id2]: { id: id2, name: 'Bob', surname: 'Builder' },
          },
          allIds: [id1, id2],
        },
        ui: { ...initialState.ui, searchInput: '' },
      }
      const filtered = selectFilteredNameRecords({ [name]: state }, '')
      expect(filtered).toHaveLength(2)
      expect(filtered).toEqual(
        expect.arrayContaining([
          { id: id1, name: 'Alice', surname: 'Wonder' },
          { id: id2, name: 'Bob', surname: 'Builder' },
        ]),
      )
    })
  })
})
