import { StyleSheet } from 'react-native'

import theme from '@victorli/7guis-ui-mobile/theme'

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1, // Make container take full screen height by default
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    backgroundColor: theme.colors.background,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Add other common styles here as needed
  // e.g., row: { flexDirection: 'row', alignItems: 'center' },
})

// Optional: Export specific styles directly if preferred
// export const containerStyle = commonStyles.container;
