import { Label } from '@radix-ui/react-label'
import { Flex, Text, TextField } from '@radix-ui/themes'

import { useAppDispatch, useAppSelector } from '@7guis/state/hooks'
import {
  selectTemperatures,
  temperatureChanged,
} from '@7guis/state/temperatureConverterSlice'

export default function TemperatureConverter() {
  const dispatch = useAppDispatch()
  const { celsius, fahrenheit } = useAppSelector(selectTemperatures)
  return (
    <Flex gap={{ initial: '2', sm: '3' }} align="center">
      <Flex
        align={{ initial: 'start', sm: 'center' }}
        direction={{ initial: 'column', sm: 'row' }}
        gap={{ initial: '1', sm: '3' }}
      >
        <TextField.Root
          id="celsius"
          size={{ initial: '2', sm: '3' }}
          placeholder="°C"
          value={celsius}
          type="number"
          onChange={(event) => {
            dispatch(
              temperatureChanged({
                temperatureType: 'celsius',
                value: event.currentTarget.value,
              }),
            )
          }}
        />
        <Label htmlFor="celsius">
          <Text size={{ initial: '5', sm: '6' }}>Celsius</Text>
        </Label>
      </Flex>

      <Text size={{ initial: '5', sm: '6' }}>=</Text>

      <Flex
        align={{ initial: 'start', sm: 'center' }}
        direction={{ initial: 'column', sm: 'row' }}
        gap={{ initial: '1', sm: '3' }}
      >
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
