import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { Box, Flex, Heading, Link, Text } from '@radix-ui/themes'

import GuiDisplay from 'components/GuiDisplay'
import CRUDGui from 'components/guis/CRUD'

export default function CRUD() {
  return (
    <>
      <Heading size="8" mb="2" className="scroll-mt-16">
        CRUD
      </Heading>
      <GuiDisplay
        content={<CRUDGui />}
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
          href="https://github.com/iamvictorli/7gui/blob/main/src/state/crudSlice.ts">
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
            <Text>
              Create a user interface with the following elements: a text field
              for a prefix, two text fields for first and last names, a listbox,
              buttons for creating, updating, and deleting, and three labels.
            </Text>
          </li>
          <li>
            <Text>
              The listbox displays names from a database, allowing only one
              selection at a time.
            </Text>
          </li>
          <li>
            <Text>
              Entering a string in the prefix text field filters the names by
              surnames that start with the entered prefix in real-time, without
              needing to press enter.
            </Text>
          </li>
          <li>
            <Text>
              The &quot;Create&quot; button appends a new name, created by
              combining the first and last names, to the list.
            </Text>
          </li>
          <li>
            <Text>
              The &quot;Update&quot; and &quot;Delete&quot; buttons are only
              enabled when a name is selected in the list.
            </Text>
          </li>
          <li>
            <Text>
              The &quot;Update&quot; button replaces the selected name with the
              new one from the text fields, while the &quot;Delete&quot; button
              removes the selected name.
            </Text>
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
