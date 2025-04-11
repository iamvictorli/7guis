import type { FlatListProps } from 'react-native'

import React from 'react'
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native'

import { Text } from './Text'
import theme from './theme'

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.l,
  },
  // Style for the View wrapper around the empty text/component if needed
  emptyContainer: {
    flex: 1, // Ensure it can take up space if FlatList is within a flex container
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.l,
    minHeight: 150, // Give it some minimum height
  },
  // Style specifically for the empty text message
  emptyText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  // Style for the FlatList's content container when empty, helps center custom components
  emptyContentContainer: {
    flexGrow: 1, // Allow the container to grow
    justifyContent: 'center', // Center the empty component vertically
    alignItems: 'center', // Center the empty component horizontally
  },
})

// Define additional props for our wrapper
export interface ListViewProps<T> extends Omit<FlatListProps<T>, 'ListEmptyComponent'> {
  /** Optional message to display when the list data is empty. */
  emptyStateMessage?: string
  /** Optional custom component to display when the list data is empty. Takes precedence over emptyStateMessage. */
  EmptyStateComponent?: React.ComponentType<any> | React.ReactElement | null
  // Example: Add loading state prop
  // isLoading?: boolean;
}

// Default key extractor: tries 'id', then 'key', falls back to index (with warning)
function defaultKeyExtractor<T>(item: T, index: number): string {
  if (item && typeof item === 'object') {
    if ('id' in item && item.id !== undefined && item.id !== null) {
      return String(item.id)
    }
    if ('key' in item && item.key !== undefined && item.key !== null) {
      return String(item.key)
    }
  }
  // console.warn(`ListView item at index ${index} missing 'id' or 'key'. Using index as key.`);
  return String(index)
}

export function ListView<T>({
  emptyStateMessage,
  EmptyStateComponent,
  keyExtractor,
  // isLoading, // Example: Handle loading state
  ...rest // Pass all other FlatListProps
}: ListViewProps<T>) {
  // Determine the component to render when the list is empty
  const renderEmptyState = (): React.ReactElement | null => {
    if (EmptyStateComponent) {
      // If it's a component type, instantiate it. If it's already an element, render it.
      if (typeof EmptyStateComponent === 'function') {
        // Needs to be ComponentType<any> or FC<any> for this check
        // If it's just React.ReactElement, this branch won't be hit correctly.
        // Let's refine the type and check if it's a valid element first.
        if (React.isValidElement(EmptyStateComponent)) {
          return EmptyStateComponent
        }
        // Assuming it's a component type (functional or class)
        const Comp = EmptyStateComponent as React.ComponentType<any>
        return <Comp />
      }
      else if (React.isValidElement(EmptyStateComponent)) {
        // It's already a React element (e.g., passed as <MyComponent />)
        return EmptyStateComponent
      }
    }
    if (emptyStateMessage) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText} variant="body">
            {emptyStateMessage}
          </Text>
        </View>
      )
    }
    return null // Default: render nothing if empty and no custom state provided
  }

  // Example: Show loading indicator
  // if (isLoading) {
  //     return (
  //         <View style={styles.loadingContainer}>
  //             <ActivityIndicator size="large" color={theme.colors.primary} />
  //         </View>
  //     );
  // }

  return (
    <FlatList<T>
      keyExtractor={keyExtractor ?? defaultKeyExtractor}
      ListEmptyComponent={renderEmptyState()}
      // Ensure content container gets style for empty state centering
      contentContainerStyle={rest.data?.length === 0 ? styles.emptyContentContainer : undefined}
      {...rest} // Pass remaining props (data, renderItem, styles, etc.)
    />
  )
}
