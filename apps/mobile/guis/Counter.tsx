import React from 'react'
import { StyleSheet, View } from 'react-native'

import { increment, selectCount } from '@victorli/7guis-state/counterSlice'
import { useAppDispatch, useAppSelector } from '@victorli/7guis-state/hooks'
import { Button } from '~/components/Button/Button'
import { Text } from '~/components/Text/Text'
import { commonStyles } from '~/styles/commonStyles'
import theme from '~/styles/theme'

const styles = StyleSheet.create({
  container: {
    // Add specific padding if centeredContent doesn't provide enough
    padding: theme.spacing.l,
  },
  countText: {
    marginBottom: theme.spacing.l, // Space between text and button
    fontSize: 48, // Make the count number larger
    fontWeight: 'bold',
  },
  button: {
    minWidth: 150, // Give the button a decent minimum width
  },
})

export function Counter() {
  const count = useAppSelector(selectCount)
  const dispatch = useAppDispatch()

  const handlePress = () => {
    dispatch(increment(1))
  }

  return (
    <View style={[commonStyles.centeredContent, styles.container]}>
      <Text variant="h1" style={styles.countText}>
        {count}
      </Text>
      <Button
        title="Increment"
        onPress={handlePress}
        style={styles.button}
      />
    </View>
  )
}
