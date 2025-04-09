import React from 'react'
import { StyleSheet, View } from 'react-native'

import { useAppDispatch, useAppSelector } from '@7guis/state/hooks'
import { selectTemperatures, temperatureChanged } from '@7guis/state/temperatureConverterSlice'
import { Text } from '~/components/Text/Text'
import { TextInput } from '~/components/TextInput/TextInput'
import { commonStyles } from '~/styles/commonStyles'
import theme from '~/styles/theme'

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.l,
    justifyContent: 'center', // Center row vertically if container has flex:1
    alignItems: 'center', // Center row horizontally
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically in the center
    width: '100%', // Take full width
    maxWidth: 400, // Limit max width for better appearance
  },
  inputContainer: {
    flex: 1, // Allow input containers to take equal space
    marginBottom: 0, // Override default bottom margin from AppTextInput container
  },
  input: {
    textAlign: 'center', // Center text within the input field
    // Adjust padding if needed
  },
  equalsText: {
    marginHorizontal: theme.spacing.m,
    fontSize: 24,
    color: theme.colors.textSecondary,
  },
})

export function TemperatureConverter() {
  const dispatch = useAppDispatch()
  const { celsius, fahrenheit } = useAppSelector(selectTemperatures)

  const handleCelsiusChange = (value: string) => {
    dispatch(temperatureChanged({
      temperatureType: 'celsius',
      value,
    }))
  }

  const handleFahrenheitChange = (value: string) => {
    dispatch(temperatureChanged({
      temperatureType: 'fahrenheit',
      value,
    }))
  }

  return (
    <View style={[commonStyles.container, styles.container]}>
      <View style={styles.inputRow}>
        <TextInput
          label="Celsius"
          value={celsius}
          onChangeText={handleCelsiusChange}
          keyboardType="numeric"
          style={styles.input} // Apply specific input style
          containerStyle={styles.inputContainer} // Control container flex
        />
        <Text style={styles.equalsText}>=</Text>
        <TextInput
          label="Fahrenheit"
          value={fahrenheit}
          onChangeText={handleFahrenheitChange}
          keyboardType="numeric"
          style={styles.input} // Apply specific input style
          containerStyle={styles.inputContainer} // Control container flex
        />
      </View>
    </View>
  )
}
