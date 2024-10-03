import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { Box, Code, Flex, Heading, Link, Text } from '@radix-ui/themes'

import GuiDisplay from '~/components/GuiDisplay'
import TemperatureConverterGUI from '~/components/guis/TemperatureConverter'

export default function TemperatureConverter() {
  return (
    <>
      <Heading size="8" mb="2" className="scroll-mt-16">
        Temperature Converter
      </Heading>

      <GuiDisplay
        content={<TemperatureConverterGUI />}
        // description will be redux debugger
        description={
          <Box
            className="box-border overflow-hidden whitespace-pre leading-6"
            py="3"
            px="4"
          />
        }
      />

      <Flex asChild align="center" gap="2" mt="5">
        <Link
          size="3"
          target="_blank"
          href="https://github.com/iamvictorli/7gui/blob/main/packages/state/src/temperatureConverterSlice.ts">
          View Redux Slice
          <Box asChild className="color=[var(--gray-9)]">
            <ArrowTopRightIcon />
          </Box>
        </Link>
      </Flex>

      <Heading size="6" mt="8" mb="3" as="h2" className="scroll-mt-16">
        Task
      </Heading>

      <Flex asChild direction="column" gap="1" pl="4" mt="3">
        <ul className="mb-5 [list-style-type:circle]">
          <li>
            <Text>
              Create a user interface with two text fields representing
              temperature in Celsius and Fahrenheit.
            </Text>
          </li>
          <li>
            <Text>Both text fields are initially empty.</Text>
          </li>
          <li>
            <Text>
              When a numerical value is entered into the Celsius field, the
              corresponding value in the Fahrenheit field is automatically
              updated.
            </Text>
          </li>
          <li>
            <Text>
              Similarly, when a numerical value is entered into the Fahrenheit
              field, the Celsius field is updated accordingly.
            </Text>
          </li>
          <li>
            <Text>
              If a non-numerical value is entered into either field, the other
              field does not update.
            </Text>
          </li>
          <li>
            <Text>
              The conversion between Celsius and Fahrenheit is done using the
              appropriate formulas for each direction.
            </Text>
          </li>
        </ul>
      </Flex>

      <Heading size="6" mt="8" mb="3" as="h2" className="scroll-mt-16">
        Thoughts
      </Heading>

      <Text mb="4" as="p" size="3">
        Another scenario where using <Code>useState</Code> would have been a
        more suitable choice.
      </Text>
    </>
  )
}
