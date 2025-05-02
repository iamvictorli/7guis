import React from 'react'
import { StyleSheet, View } from 'react-native'

import { useAppDispatch, useAppSelector } from '@victorli/7guis-state/hooks'
import { selectTemperatures, temperatureChanged } from '@victorli/7guis-state/temperatureConverterSlice'
import { Text } from '@victorli/7guis-ui-mobile/Text'
import { TextInput } from '@victorli/7guis-ui-mobile/TextInput'
import { theme } from '@victorli/7guis-ui-mobile/theme'

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.m,
  },
  equalsText: {
    color: theme.colors.textSecondary,
    fontSize: 24,
    marginHorizontal: theme.spacing.s,
    marginTop: theme.spacing.m,
  },
  input: {
    paddingHorizontal: theme.spacing.s,
    textAlign: 'center',
  },
  inputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  inputRow: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
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
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          label="Celsius"
          value={celsius}
          onChangeText={handleCelsiusChange}
          keyboardType="numeric"
          style={styles.input}
          containerStyle={styles.inputContainer}
        />
        <Text style={styles.equalsText}>=</Text>
        <TextInput
          label="Fahrenheit"
          value={fahrenheit}
          onChangeText={handleFahrenheitChange}
          keyboardType="numeric"
          style={styles.input}
          containerStyle={styles.inputContainer}
        />
      </View>
    </View>
  )
}
