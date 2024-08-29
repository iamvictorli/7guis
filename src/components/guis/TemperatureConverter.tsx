import { Box, Flex, Text, TextField } from '@radix-ui/themes'
import { useAppDispatch, useAppSelector } from '~/store'

import {
  selectTemperatures,
  temperatureChanged,
} from 'state/temperatureConverterSlice'

export default function TemperatureConverter() {
  const dispatch = useAppDispatch()
  const { celcius, fahrenheit } = useAppSelector(selectTemperatures)
  return (
    <>
      <Flex maxWidth="350px" align="center" gap="4">
        <TextField.Root
          size={{ initial: '2', sm: '3' }}
          placeholder="Celcius"
          value={celcius}
          type="number"
          onChange={(event) => {
            dispatch(
              temperatureChanged({
                temperatureType: 'celcius',
                value: event.currentTarget.value,
              }),
            )
          }}
        />
        <Text size={{ initial: '5', sm: '6' }}>Celcius</Text>
      </Flex>

      <Box height="12px" />

      <Flex maxWidth="350px" align="center" gap="4">
        <TextField.Root
          size={{ initial: '2', sm: '3' }}
          placeholder="Fahrenheit"
          value={fahrenheit}
          type="number"
          onChange={(event) => {
            dispatch(
              temperatureChanged({
                temperatureType: 'fahrenheit',
                value: event.currentTarget.value,
              }),
            )
          }}
        />
        <Text size={{ initial: '5', sm: '6' }}>Fahrenheit</Text>
      </Flex>
    </>
  )
}
