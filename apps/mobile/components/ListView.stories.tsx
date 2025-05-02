import type { Meta, StoryObj } from '@storybook/react'

import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import type { ListViewProps } from '@victorli/7guis-ui-mobile/ListView'

import { ListView } from '@victorli/7guis-ui-mobile/ListView'
import { Text } from '@victorli/7guis-ui-mobile/Text'
import { theme } from '@victorli/7guis-ui-mobile/theme'

const styles = StyleSheet.create({
  cardItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: theme.spacing.m,
    // Add shadow/elevation if desired
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41 },
      android: { elevation: 2 },
    }),
  },
  customEmptyContainer: {
    alignItems: 'center',
    backgroundColor: theme.colors.background, // Slightly different background
    borderRadius: theme.spacing.s,
    justifyContent: 'center',
    padding: theme.spacing.l,
  },
  customEmptyText: {
    marginBottom: theme.spacing.s,
    textAlign: 'center',
  },
  decoratorView: {
    borderColor: theme.colors.border,
    borderWidth: 1,
    flex: 1, // Allow list to take available space in decorator
    height: 400, // Give a fixed height for vertical lists
    padding: theme.spacing.m,
    width: '100%', // Take full width
  },
  horizontalItem: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 100, // Give horizontal items height
    justifyContent: 'center',
    marginRight: theme.spacing.m, // Space between horizontal items
    padding: theme.spacing.m,
    width: 100, // And width
  },
  separator: {
    height: theme.spacing.m, // Space between card items
  },
  simpleItem: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.m,
  },
})

// Sample Data
const simpleData = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']
const objectData = [
  { id: '101', name: 'Alice', role: 'Admin' },
  { id: '102', name: 'Bob', role: 'User' },
  { id: '103', name: 'Charlie', role: 'User' },
  { id: '104', name: 'Diana', role: 'Moderator' },
]

// Sample Custom Empty State Component
function CustomEmptyState() {
  return (
    <View style={styles.customEmptyContainer}>
      <Text variant="h2" style={styles.customEmptyText}>🤔</Text>
      <Text variant="label" style={styles.customEmptyText}>
        Nothing found here!
      </Text>
      <Text variant="caption" style={styles.customEmptyText}>
        Try adjusting your filters or adding new items.
      </Text>
    </View>
  )
}

const meta: Meta<typeof ListView> = {
  title: 'Components/ListView',
  component: ListView,
  args: {
    // Default args (most important ones defined per story)
    emptyStateMessage: 'The list is empty.',
    // EmptyStateComponent: undefined, // Handled per story
  },
  argTypes: {
    data: { control: 'object' }, // Allow editing data for experimentation
    emptyStateMessage: { control: 'text' },
    // Disable controls for complex/render props
    renderItem: { table: { disable: true } },
    keyExtractor: { table: { disable: true } },
    EmptyStateComponent: { table: { disable: true } },
    // Other FlatList props like style, ItemSeparatorComponent etc. can be added if needed
  },
  decorators: [
    Story => (
      // Give the list container some bounds in the story view
      <View style={styles.decoratorView}>
        <Story />
      </View>
    ),
  ],
}

export default meta

// Define a base type for stories, making T default to unknown if not specified
type Story<T = unknown> = StoryObj<ListViewProps<T>>

// --- Stories ---

export const SimpleList: Story<string> = {
  args: {
    data: simpleData,
    renderItem: ({ item }) => (
      <View style={styles.simpleItem}>
        <Text>{item}</Text>
      </View>
    ),
    // keyExtractor uses default here (index as string for simple strings)
    // Or explicitly: keyExtractor: (item) => item,
  },
}

export const EmptyListWithMessage: Story<string> = {
  args: {
    data: [],
    renderItem: ({ item }) => <Text>{item}</Text>, // Will not render
    emptyStateMessage: 'No fruits available right now.', // Custom message
    // keyExtractor: (item) => item,
  },
}

export const EmptyListWithComponent: Story<any> = {
  args: {
    data: [],
    renderItem: ({ item }) => <Text>{item.name}</Text>, // Will not render
    EmptyStateComponent: CustomEmptyState, // Use the custom component (passed as type)
    // Or pass as element: EmptyStateComponent: <CustomEmptyState />,
    emptyStateMessage: 'This message is hidden', // Will be ignored
  },
}

export const ListWithStyledItems: Story<{ id: string, name: string, role: string }> = {
  args: {
    data: objectData,
    renderItem: ({ item }) => (
      <View style={styles.cardItem}>
        <Text variant="h2">{item.name}</Text>
        <Text variant="label">
          Role:
          {item.role}
        </Text>
      </View>
    ),
    // Let default keyExtractor handle `item.id`
    // keyExtractor: (item) => item.id,
    ItemSeparatorComponent: () => <View style={styles.separator} />, // Add separator
  },
}

export const HorizontalList: Story<string> = {
  args: {
    data: simpleData,
    renderItem: ({ item }) => (
      <View style={styles.horizontalItem}>
        <Text>{item}</Text>
      </View>
    ),
    horizontal: true, // Enable horizontal mode
    showsHorizontalScrollIndicator: false,
    // keyExtractor: (item) => item,
  },
}
