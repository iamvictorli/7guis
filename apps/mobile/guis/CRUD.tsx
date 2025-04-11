import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import type { Name } from '@victorli/7guis-state/crudSlice'

import { nameCreated, nameDeleted, nameInputChanged, nameSelected, nameUpdated, searchChanged, selectFilteredNameRecords, selectUI, surnameInputChanged } from '@victorli/7guis-state/crudSlice'
import { useAppDispatch, useAppSelector } from '@victorli/7guis-state/hooks'
import { Button } from '@victorli/7guis-ui-mobile/Button'
import { ListView } from '@victorli/7guis-ui-mobile/ListView'
import { Text } from '@victorli/7guis-ui-mobile/Text'
import { TextInput } from '@victorli/7guis-ui-mobile/TextInput'
import { theme } from '@victorli/7guis-ui-mobile/theme'
import { commonStyles } from '~/styles/commonStyles'

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.m,
    flex: 1,
  },
  // New style for the search bar container
  searchBarContainer: {
    marginBottom: theme.spacing.m, // Space below search bar
  },
  searchInput: { // Style for the TextInput container itself
    marginBottom: 0, // Remove default TextInput margin
  },
  // Renamed from filterRow
  detailInputsRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.m,
    gap: theme.spacing.m,
  },
  // Renamed from filterInput
  detailInput: {
    flex: 1,
    marginBottom: 0,
  },
  listContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.m,
    borderRadius: theme.spacing.xs,
  },
  listItem: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  listItemSelected: {
    backgroundColor: theme.colors.primary,
  },
  listItemText: {
    color: theme.colors.text,
  },
  listItemSelectedText: {
    color: theme.colors.surface,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
})

export function CRUD() {
  const dispatch = useAppDispatch()
  const { nameInput, surnameInput, searchInput, nameSelectedId } = useAppSelector(selectUI)
  const filteredNameRecords = useAppSelector(state =>
    selectFilteredNameRecords(state, searchInput),
  )

  const handleCreate = () => {
    dispatch(nameCreated({
      name: nameInput,
      surname: surnameInput,
    }))
  }

  const handleUpdate = () => {
    dispatch(nameUpdated({
      id: nameSelectedId,
      name: nameInput,
      surname: surnameInput,
    }))
  }

  const handleDelete = () => {
    dispatch(nameDeleted(nameSelectedId))
  }

  // --- Render Item for List ---
  const renderItem = ({ item }: { item: Name }) => {
    const isSelected = item.id === nameSelectedId
    return (
      <Pressable
        onPress={() => dispatch(nameSelected(item.id))}
        style={[styles.listItem, isSelected && styles.listItemSelected]}
      >
        <Text style={isSelected ? styles.listItemSelectedText : styles.listItemText}>
          {item.surname}
          ,
          {' '}
          {item.name}
        </Text>
      </Pressable>
    )
  }

  const isUpdateDisabled = nameSelectedId === ''
  const isDeleteDisabled = nameSelectedId === ''

  return (
    <View style={[commonStyles.container, styles.container]}>
      <View style={styles.searchBarContainer}>
        <TextInput
          label="Search"
          placeholder="Search"
          value={searchInput}
          onChangeText={text => dispatch(searchChanged(text))}
          containerStyle={styles.searchInput}
        />
      </View>

      {/* Name/Surname Detail Inputs */}
      <View style={styles.detailInputsRow}>
        <TextInput
          label="Name"
          value={nameInput}
          onChangeText={text => dispatch(nameInputChanged(text))}
          containerStyle={styles.detailInput}
        />
        <TextInput
          label="Surname"
          value={surnameInput}
          onChangeText={text => dispatch(surnameInputChanged(text))}
          containerStyle={styles.detailInput}
        />
      </View>

      <View style={styles.listContainer}>
        <ListView
          data={filteredNameRecords}
          renderItem={renderItem}
          keyExtractor={item => item.id} // Use stable ID for keys
          emptyStateMessage="No matching entries found."
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <Button title="Create" onPress={handleCreate} style={styles.button} />
        <Button title="Update" onPress={handleUpdate} disabled={isUpdateDisabled} style={styles.button} />
        <Button title="Delete" onPress={handleDelete} disabled={isDeleteDisabled} style={styles.button} />
      </View>
    </View>
  )
}
