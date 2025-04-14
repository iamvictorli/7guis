import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { Box, Code, Flex, Heading, Link, Text } from '@radix-ui/themes'

import GuiDisplay from '~/components/GuiDisplay'
import CounterGUI from '~/components/guis/Counter'
import SnackEmbed from '~/components/SnackEmbed'

export default function Counter() {
  return (
    <>
      <Heading size="8" mb="2" className="scroll-mt-16">
        Counter
      </Heading>
      <GuiDisplay
        content={<CounterGUI />}
        // description will be redux debugger
        description={(
          <Box
            className="box-border overflow-hidden whitespace-pre leading-6"
            py="3"
            px="4"
          />
        )}
      />

      <SnackEmbed snackId="@livictor/counter-react-native" />

      <Flex asChild align="center" gap="2" mt="5">
        <Link
          size="3"
          target="_blank"
          href="https://github.com/iamvictorli/7guis/blob/main/packages/state/src/counterSlice.ts"
        >
          View Redux Slice
          <Box asChild className="text-[var(--gray-9)]">
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
              Build a user interface that contains a label or read-only text
              field and a button.
            </Text>
          </li>
          <li>
            <Text>
              Initially, display the value &quot;0&quot; in the text field.
            </Text>
          </li>
          <li>
            <Text>
              Each time the button is clicked, increase the value displayed in
              the text field by one.
            </Text>
          </li>
        </ul>
      </Flex>

      <Heading size="6" mt="8" mb="3" as="h2" className="scroll-mt-16">
        Thoughts
      </Heading>

      <Text mb="4" as="p" size="3">
        A simple counter example that could have been more easily implemented
        using
        {' '}
        <Code>useState</Code>
        .
      </Text>
    </>
  )
}
