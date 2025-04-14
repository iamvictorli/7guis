import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { Box, Flex, Heading, Link, Strong, Text } from '@radix-ui/themes'

import GuiDisplay from '~/components/GuiDisplay'
import CircleDrawerGui from '~/components/guis/CircleDrawer'
import SnackEmbed from '~/components/SnackEmbed'

export default function CircleDrawer() {
  return (
    <>
      <Heading size="8" mb="2" className="scroll-mt-16">
        Circle Drawer
      </Heading>
      <GuiDisplay
        content={<CircleDrawerGui />}
        // description will be redux debugger
        description={(
          <Box
            className="box-border overflow-hidden whitespace-pre leading-6"
            py="3"
            px="4"
          />
        )}
      />

      <SnackEmbed snackId="@livictor/circledrawer-react-native" />

      <Flex asChild align="center" gap="2" mt="5">
        <Link
          size="3"
          target="_blank"
          href="https://github.com/iamvictorli/7guis/blob/main/packages/state/src/circleDrawerSlice.ts"
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
              Create a user interface with undo and redo buttons and a canvas
              area.
            </Text>
          </li>
          <li>
            <Text>
              Left-clicking on an empty area of the canvas creates an unfilled
              circle at the click location with a fixed diameter.
            </Text>
          </li>
          <li>
            <Text>
              If a circle exists near the mouse pointer, where the
              pointer&apos;s distance to the circle&apos;s center is less than
              its radius, that circle is filled with gray and becomes the
              selected circle.
            </Text>
          </li>
          <li>
            <Text>
              Right-clicking the selected circle opens a popup menu with an
              option labeled &quot;Adjust diameter.&quot;
            </Text>
          </li>
          <li>
            <Text>
              Clicking &quot;Adjust diameter&quot; opens a new frame with a
              slider to adjust the diameter of the selected circle in real-time.
            </Text>
          </li>
          <li>
            <Text>
              Closing the slider frame records the diameter adjustment as a
              significant change for undo/redo tracking.
            </Text>
          </li>
          <li>
            <Text>
              Clicking undo reverses the last significant change (either circle
              creation or diameter adjustment).
            </Text>
          </li>
          <li>
            <Text>
              Clicking redo re-applies the last undone change unless new changes
              have been made.
            </Text>
          </li>
        </ul>
      </Flex>

      <Heading size="6" mt="8" mb="3" as="h2" className="scroll-mt-16">
        Thoughts
      </Heading>

      <Text mb="4" as="p" size="3">
        Implementing the circle drawer felt similar to the CRUD application
        since it also involves managing a collection of records—in this case,
        circles on a canvas. However, the main difference here is the inclusion
        of
        {' '}
        <Strong>undo/redo</Strong>
        {' '}
        functionality, which adds a new layer of
        complexity.
      </Text>

      <Text mb="4" as="p" size="3">
        I used a
        {' '}
        <Strong>snapshot-based approach</Strong>
        , where each action,
        like creating a circle or adjusting its size, stores the entire current
        state of the canvas and makes a new copy with appending new state
        changes. A disadvantage of this approach is that it can become
        memory-intensive as the number of snapshots increases when there are
        numerous circles and circle changes.
      </Text>

      <Text mb="4" as="p" size="3">
        A better more memory-efficient approach would be to utilize a stack of
        actions. Instead of storing the entire state after every change, we
        record the specific actions performed (e.g., &quot;add circle,&quot;
        &quot;update circle&quot;) and use these actions to reverse or reapply
        changes. This method consumes significantly less memory because it only
        tracks the necessary steps to modify the state rather than duplicating
        the entire state each time.
      </Text>

      <Text mb="4" as="p" size="3">
        <Strong>Edit:</Strong>
        {' '}
        Changed to use stack of actions for undo/redo
        functionality
      </Text>
    </>
  )
}
