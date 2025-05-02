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
  button: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  buttonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  container: {
    flex: 1,
    padding: theme.spacing.m,
  },
  detailInput: {
    flex: 1,
    marginBottom: 0,
  },
  detailInputsRow: {
    flexDirection: 'row',
    gap: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  listContainer: {
    borderColor: theme.colors.border,
    borderRadius: theme.spacing.xs,
    borderWidth: 1,
    flex: 1,
    marginBottom: theme.spacing.m,
  },
  listItem: {
    backgroundColor: theme.colors.surface,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.m,
  },
  listItemSelected: {
    backgroundColor: theme.colors.primary,
  },
  listItemSelectedText: {
    color: theme.colors.surface,
  },
  listItemText: {
    color: theme.colors.text,
  },
  searchBarContainer: {
    marginBottom: theme.spacing.m, // Space below search bar
  },
  searchInput: { // Style for the TextInput container itself
    marginBottom: 0, // Remove default TextInput margin
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
