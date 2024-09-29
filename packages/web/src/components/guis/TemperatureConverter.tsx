import { Label } from '@radix-ui/react-label'
import { Flex, Text, TextField } from '@radix-ui/themes'

import {
  selectTemperatures,
  temperatureChanged,
} from '@7gui/state/temperatureConverterSlice'

import { useAppDispatch, useAppSelector } from '~/store'

export default function TemperatureConverter() {
  const dispatch = useAppDispatch()
  const { celcius, fahrenheit } = useAppSelector(selectTemperatures)
  return (
    <Flex gap={{ initial: '2', sm: '3' }} align="center">
      <Flex
        align={{ initial: 'start', sm: 'center' }}
        direction={{ initial: 'column', sm: 'row' }}
        gap={{ initial: '1', sm: '3' }}>
        <TextField.Root
          id="celcius"
          size={{ initial: '2', sm: '3' }}
          placeholder="°C"
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
        <Label htmlFor="celcius">
          <Text size={{ initial: '5', sm: '6' }}>Celcius</Text>
        </Label>
      </Flex>

      <Text size={{ initial: '5', sm: '6' }}>=</Text>

      <Flex
        align={{ initial: 'start', sm: 'center' }}
        direction={{ initial: 'column', sm: 'row' }}
        gap={{ initial: '1', sm: '3' }}>
        <TextField.Root
          id="fahrenheit"
          size={{ initial: '2', sm: '3' }}
          placeholder="°F"
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
        <Label htmlFor="fahrenheit">
          <Text size={{ initial: '5', sm: '6' }}>Fahrenheit</Text>
        </Label>
      </Flex>
    </Flex>
  )
}
