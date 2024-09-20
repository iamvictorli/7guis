import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { Box, Code, Flex, Heading, Link, Strong, Text } from '@radix-ui/themes'

import GuiDisplay from 'components/GuiDisplay'
import TimerGUI from 'components/guis/Timer'

export default function Timer() {
  return (
    <>
      <Heading size="8" mb="2" className="scroll-mt-16">
        Timer
      </Heading>
      <GuiDisplay
        content={<TimerGUI />}
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
          href="https://github.com/iamvictorli/7gui/blob/main/src/state/timerSlice.ts">
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
              Create a user interface with a gauge to display elapsed time, a
              label showing elapsed time as a numerical value, a slider to
              adjust the timer&apos;s duration, and a reset button.
            </Text>
          </li>
          <li>
            <Text>
              The slider allows the duration to be adjusted in real-time while
              the timer is running.
            </Text>
          </li>
          <li>
            <Text>
              Adjusting the slider immediately updates the duration, and the
              gauge reflects the change as it&apos;s moved.
            </Text>
          </li>
          <li>
            <Text>
              The timer stops when the elapsed time reaches or exceeds the set
              duration, and the gauge becomes full.
            </Text>
          </li>
          <li>
            <Text>
              If the duration is increased after the timer stops, the timer
              restarts and runs until the elapsed time meets the new duration.
            </Text>
          </li>
          <li>
            <Text>The reset button sets the elapsed time back to zero.</Text>
          </li>
        </ul>
      </Flex>

      <Heading size="6" mt="8" mb="3" as="h2" className="scroll-mt-16">
        Thoughts
      </Heading>

      <Text mb="4" as="p" size="3">
        Implementing a timer in this application requires managing{' '}
        <Strong>side effects</Strong>, particularly when it comes to handling
        intervals and time-based updates. Since Redux is focused on state
        management and encourages pure functions, handling side effects like
        intervals must be carefully managed to keep the logic clean and
        predictable.
      </Text>

      <Text mb="4" as="p" size="3">
        I used Redux to manage the core state for the timer, specifically
        tracking the start time, current time, and duration. For side effects,
        like handling intervals and timeouts, I relied on React’s{' '}
        <Code>useEffect</Code> hook. This approach worked well, as React effects
        allowed me to manage the asynchronous logic needed to update the timer
        in real-time while keeping the Redux store focused on managing state.
      </Text>

      <Text mb="4" as="p" size="3">
        However, while this method was effective, there&rsquo;s room for
        improvement in how side effects are handled. A follow-up idea I’m eager
        to explore is using the{' '}
        <Link href="https://redux-toolkit.js.org/api/createListenerMiddleware">
          createListenerMiddleware API
        </Link>{' '}
        from Redux Toolkit. This middleware is specifically designed to handle
        side effects within Redux, enabling a more Redux-centric approach to
        managing asynchronous logic like intervals and timeouts.
      </Text>

      <Text mb="4" as="p" size="3">
        <Link href="https://redux.js.org/usage/side-effects-approaches">
          Side Effect Approaches in Redux
        </Link>
      </Text>
    </>
  )
}
