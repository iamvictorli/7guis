import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import type { Name } from '@7guis/state/crudSlice'

import { nameCreated, nameDeleted, nameInputChanged, nameSelected, nameUpdated, selectFilteredNameRecords, selectUI, surnameInputChanged } from '@7guis/state/crudSlice'
import { useAppDispatch, useAppSelector } from '@7guis/state/hooks'
import { Button } from '~/components/Button/Button'
import { ListView } from '~/components/ListView/ListView'
import { Text } from '~/components/Text/Text'
import { TextInput } from '~/components/TextInput/TextInput'
import { commonStyles } from '~/styles/commonStyles'
import theme from '~/styles/theme' // Adjust path

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.m,
    flex: 1, // Make container take full height
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.m,
    gap: theme.spacing.m, // Use gap for spacing between inputs
  },
  filterInput: {
    flex: 1, // Make inputs share width
    marginBottom: 0, // Remove default margin from input container
  },
  listContainer: {
    flex: 1, // Allow list to take remaining vertical space
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
    backgroundColor: theme.colors.surface, // Default background
  },
  listItemSelected: {
    backgroundColor: theme.colors.primary, // Highlight color
  },
  listItemText: {
    color: theme.colors.text,
  },
  listItemSelectedText: {
    color: theme.colors.surface, // Text color on highlight
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribute buttons evenly
    alignItems: 'center',
  },
  button: {
    flex: 1, // Allow buttons to grow
    marginHorizontal: theme.spacing.xs, // Add small space between buttons
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
          {item.name}
        </Text>
      </Pressable>
    )
  }

  const isUpdateDisabled = nameSelectedId === ''
  const isDeleteDisabled = nameSelectedId === ''

  return (
    <View style={[commonStyles.container, styles.container]}>
      {/* Filter Inputs */}
      <View style={styles.filterRow}>
        <TextInput
          label="Filter Name"
          value={nameInput}
          onChangeText={text => dispatch(nameInputChanged(text))}
          containerStyle={styles.filterInput}
        />
        <TextInput
          label="Filter Surname"
          value={surnameInput}
          onChangeText={text => dispatch(surnameInputChanged(text))}
          containerStyle={styles.filterInput}
        />
      </View>

      {/* List View */}
      <View style={styles.listContainer}>
        <ListView
          data={filteredNameRecords}
          renderItem={renderItem}
          emptyStateMessage="No matching entries found."
        // style={{ flex: 1 }} // Ensure list takes space
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
