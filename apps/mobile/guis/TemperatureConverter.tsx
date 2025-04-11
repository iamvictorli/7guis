import React from 'react'
import { StyleSheet, View } from 'react-native'

import { useAppDispatch, useAppSelector } from '@victorli/7guis-state/hooks'
import { selectTemperatures, temperatureChanged } from '@victorli/7guis-state/temperatureConverterSlice'
import { Text } from '~/components/Text/Text'
import { TextInput } from '~/components/TextInput/TextInput'
import theme from '~/styles/theme'

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.m,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  inputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  input: {
    textAlign: 'center',
    paddingHorizontal: theme.spacing.s,
  },
  equalsText: {
    marginHorizontal: theme.spacing.s,
    fontSize: 24,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.m,
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
