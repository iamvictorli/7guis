import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { Box, Code, Flex, Heading, Link, Text } from '@radix-ui/themes'

import GuiDisplay from '~/components/GuiDisplay'
import FlightBookerGUI from '~/components/guis/FlightBooker'

export default function FlightBooker() {
  return (
    <>
      <Heading size="8" mb="2" className="scroll-mt-16">
        Flight Booker
      </Heading>
      <GuiDisplay
        content={<FlightBookerGUI />}
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
          href="https://github.com/iamvictorli/7gui/blob/main/packages/state/src/flightBookerSlice.ts">
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
              Create a user interface with a combobox offering &quot;one-way
              flight&quot; and &quot;return flight&quot; options, two text
              fields for start and return dates, and a submit button.
            </Text>
          </li>
          <li>
            <Text>
              The return date field is only enabled when &quot;return
              flight&quot; is selected in the combobox.
            </Text>
          </li>
          <li>
            <Text>
              If &quot;return flight&quot; is selected and the return date is
              before the start date, the submit button is disabled.
            </Text>
          </li>
          <li>
            <Text>
              If a text field has an improperly formatted date, it turns red and
              the submit button is disabled.
            </Text>
          </li>
          <li>
            <Text>
              When the submit button is clicked, a message is displayed
              summarizing the user&rsquo;s selection.
            </Text>
          </li>
          <li>
            <Text>
              Initially, the combobox is set to &quot;one-way flight,&quot; both
              date fields have the same arbitrary date, and the return date
              field is disabled.
            </Text>
          </li>
        </ul>
      </Flex>

      <Heading size="6" mt="8" mb="3" as="h2" className="scroll-mt-16">
        Thoughts
      </Heading>

      <Text mb="4" as="p" size="3">
        Implementing date pickers presents several hard challenges, including
        design, user experience, and accessibility.
      </Text>

      <Text mb="4" as="p" size="3">
        While creating a standard date picker is tricky, building a date range
        picker adds even more complexity.
      </Text>

      <Text mb="4" as="p" size="3">
        The <Code>&lt;input type=&quot;date&quot; /&gt;</Code> element provides
        support for date pickers, but broader date/time/month/week types are
        only{' '}
        <Link href="https://caniuse.com/input-datetime">
          partially supported by all browsers
        </Link>
        .
      </Text>

      <Text mb="4" as="p" size="3">
        I decided to use{' '}
        <Link href="https://react-spectrum.adobe.com/react-aria/index.html">
          React Aria
        </Link>{' '}
        for building both the date picker and date range picker due to its
        built-in accessibility, composability, and flexibility. There is a
        learning curve when working with the broader React Aria
        ecosystem—including{' '}
        <Link href="https://react-spectrum.adobe.com/react-stately/index.html">
          React Stately
        </Link>{' '}
        for state management and{' '}
        <Link href="https://react-spectrum.adobe.com/internationalized/date/index.html">
          @internationalized/date
        </Link>{' '}
        for working with dates.
      </Text>

      <Text mb="4" as="p" size="3">
        <Link href="https://infiniteundo.com/post/25326999628/falsehoods-programmers-believe-about-time">
          Dates are super hard to work with.
        </Link>
      </Text>

      <Text mb="4" as="p" size="3">
        <Link href="https://react-spectrum.adobe.com/blog/date-and-time-pickers-for-all.html">
          https://react-spectrum.adobe.com/blog/date-and-time-pickers-for-all.html
        </Link>
      </Text>

      <Text mb="4" as="p" size="3">
        <Link href="https://react-spectrum.adobe.com/react-aria/useDatePicker.html#styled-examples">
          https://react-spectrum.adobe.com/react-aria/useDatePicker.html#styled-examples
        </Link>
      </Text>

      <Text mb="4" as="p" size="3">
        <Link href="https://react-spectrum.adobe.com/react-aria/useDateRangePicker.html#styled-examples">
          https://react-spectrum.adobe.com/react-aria/useDateRangePicker.html#styled-examples
        </Link>
      </Text>

      <Text mb="4" as="p" size="3">
        <Link href="https://codesandbox.io/p/sandbox/reverent-faraday-5nwk87">
          https://codesandbox.io/p/sandbox/reverent-faraday-5nwk87
        </Link>
      </Text>

      <Heading size="6" mt="8" mb="3" as="h2" className="scroll-mt-16">
        Followups
      </Heading>

      <Text mb="4" as="p" size="3">
        While working on the flight booker, I’ve taken inspiration from popular
        flight booking sites like{' '}
        <Link href="https://www.google.com/travel/flights">Google Flights</Link>{' '}
        and <Link href="https://www.skyscanner.com/">Skyscanner</Link>. Below
        are key tasks I would like to implement (if I had more time), following
        their design principles:
      </Text>

      <Heading size="4" mt="7" mb="2" as="h3" className="scroll-mt-16">
        Range Calendar Behavior
      </Heading>

      <Text mb="4" as="p" size="3">
        When a start date is selected but no end date is chosen, only the start
        date should be highlighted on the date range picker.
      </Text>

      <Heading size="4" mt="7" mb="2" as="h3" className="scroll-mt-16">
        Consistent Date Picker Sizing
      </Heading>

      <Text mb="4" as="p" size="3">
        The one-way date picker should maintain the same width as the date range
        picker for visual consistency.
      </Text>

      <Heading size="4" mt="7" mb="2" as="h3" className="scroll-mt-16">
        Date Format Display
      </Heading>

      <Text mb="4" as="p" size="3">
        The selected dates should be displayed using the shortened weekday,
        month name, and day format. For example: &quot;Tue, Sep 3&quot;.
      </Text>

      <Heading size="4" mt="7" mb="2" as="h3" className="scroll-mt-16">
        Continuous Month View
      </Heading>

      <Text mb="4" as="p" size="3">
        The date picker popover should display two months side by side for easy
        navigation.
      </Text>

      <Heading size="4" mt="7" mb="2" as="h3" className="scroll-mt-16">
        Mobile Design
      </Heading>

      <Text mb="4" as="p" size="3">
        On mobile devices, the date picker popover should take up the entire
        screen. Instead of &quot;next&quot; and &quot;previous&quot; buttons,
        users should be able to scroll through the months seamlessly.
      </Text>
    </>
  )
}
