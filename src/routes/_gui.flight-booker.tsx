import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { Box, Flex, Heading, Link, ScrollArea, Text } from '@radix-ui/themes'

import FlightBookerGUI from 'components/guis/FlightBooker'

export default function FlightBooker() {
  return (
    <>
      <Heading size="8" mb="2" className="scroll-mt-16">
        Flight Booker
      </Heading>
      <Box
        my="5"
        className="relative border-box bg-[var(--accent-2)] rounded-lg after:absolute after:content=[''] after:top-0 after:left-0 after:bottom-0 after:right-0 after:[box-shadow:0_0_0_1px_var(--gray-a5)] after:rounded-lg after:pointer-events-none">
        {/* Preview */}
        <Box className="text-pretty bg-white [border-radius:8px_8px_0_0] [box-shadow:inset_0_-1px_var(--gray-a5)]">
          <ScrollArea>
            {/* Preview Inner */}
            <Box p="4" className="leading-none">
              <FlightBookerGUI />
            </Box>
          </ScrollArea>
        </Box>

        <Box className="box-border" position="relative" height="100%">
          {/* This would be where redux debugger will be */}
          {/* similar to CodeBlock Pre */}
          {/* may or may not need ScrollArea */}
          <ScrollArea>
            <Box
              className="box-border overflow-hidden leading-6 whitespace-pre"
              py="3"
              px="4"
            />
          </ScrollArea>
        </Box>
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
