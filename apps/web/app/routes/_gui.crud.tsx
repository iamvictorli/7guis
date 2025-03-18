import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { Box, Code, Flex, Heading, Link, Text } from '@radix-ui/themes'

import GuiDisplay from '~/components/GuiDisplay'
import CRUDGui from '~/components/guis/CRUD'

export default function CRUD() {
  return (
    <>
      <Heading size="8" mb="2" className="scroll-mt-16">
        CRUD
      </Heading>
      <GuiDisplay
        content={<CRUDGui />}
        // description will be redux debugger
        description={(
          <Box
            className="box-border overflow-hidden whitespace-pre leading-6"
            py="3"
            px="4"
          />
        )}
      />

      <Flex asChild align="center" gap="2" mt="5">
        <Link
          size="3"
          target="_blank"
          href="https://github.com/iamvictorli/7guis/blob/main/packages/state/src/crudSlice.ts"
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
        Implementing CRUD functionality is a common requirement in many
        applications. Using Redux for UI state management increased the lines of
        code (LOC) that there&apos;s more Redux UI state code than CRUD business
        logic. Utilizing
        {' '}
        <Code>useState</Code>
        {' '}
        for UI code would&apos;ve been a
        better choice for the component&apos;s internal state.
      </Text>

      <Text mb="4" as="p" size="3">
        I chose to use
        {' '}
        <Link href="https://react-spectrum.adobe.com/react-aria/useListBox.html">
          Listbox
        </Link>
        {' '}
        from React Aria because Radix UI doesn’t offer a built-in option for
        this functionality.
      </Text>

      <Text mb="4" as="p" size="3">
        <Link href="https://redux.js.org/faq/organizing-state">
          Organizing State in Redux
        </Link>
      </Text>
    </>
  )
}
