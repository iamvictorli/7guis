import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { Box, Flex, Heading, Link, Text } from '@radix-ui/themes'
import TemperatureConverterGUI from '~/components/guis/TemperatureConverter'

export default function TemperatureConverter() {
  return (
    <>
      <Heading size="8" mb="2" className="scroll-mt-16">
        Temperature Converter
      </Heading>
      {/* TODO: wrap children with similar to CodeBlock */}
      <Box
        my="5"
        className="relative border-box bg-[var(--accent-2)] border-r-[var(--radius-4)]">
        <TemperatureConverterGUI />
      </Box>

      <Flex asChild align="center" gap="2" mt="5">
        <Link size="3" target="_blank" href="https://github.com">
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
