import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { Box, Flex, Heading, Link, Text } from '@radix-ui/themes'

import GuiDisplay from 'components/GuiDisplay'
import TemperatureConverterGUI from 'components/guis/TemperatureConverter'

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
          href="https://github.com/iamvictorli/7gui/blob/main/src/state/temperatureConverterSlice.ts">
          View Redux Slice
          <Box asChild className="color=[var(--gray-9)]">
            <ArrowTopRightIcon />
          </Box>
        </Link>
      </Flex>

      <Heading size="6" mt="8" mb="3" as="h2" className="scroll-mt-16">
        Task
      </Heading>

      <Flex
        asChild
        direction="column"
        gap="1"
        pl="4"
        mt="3"
        className="mb-5 [list-style-type:circle]">
        <ul className="list-disc">
          <li>
            <Text>hello</Text>
          </li>
          <li>
            <Text>hello</Text>
          </li>
          <li>
            <Text>hello</Text>
          </li>
        </ul>
      </Flex>

      <Heading size="6" mt="8" mb="3" as="h2" className="scroll-mt-16">
        Thoughts
      </Heading>

      <Text mb="4" as="p" size="3">
        blah blah blah blah
      </Text>
    </>
  )
}
