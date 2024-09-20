import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import {
  Box,
  Code,
  Em,
  Flex,
  Heading,
  Kbd,
  Link,
  Strong,
  Text,
} from '@radix-ui/themes'

import GuiDisplay from 'components/GuiDisplay'
import CellsGui from 'components/guis/Cells'

export default function Cells() {
  return (
    <>
      <Heading size="8" mb="2" className="scroll-mt-16">
        Cells
      </Heading>

      <GuiDisplay
        content={<CellsGui />}
        // description will be redux debugger
        description={
          <Box
            className="box-border overflow-hidden whitespace-pre leading-6"
            py="3"
            px="4"
          />
        }
        displayBoxProps={{ height: '400px' }}
      />

      <Flex asChild align="center" gap="2" mt="5">
        <Link
          size="3"
          target="_blank"
          href="https://github.com/iamvictorli/7gui/blob/main/src/state/cellsSlice.ts">
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
              Create a scrollable spreadsheet application with numbered rows
              (0-99) and lettered columns (A-Z).
            </Text>
          </li>
          <li>
            <Text>
              Double-clicking on a cell allows the user to edit its formula.
            </Text>
          </li>
          <li>
            <Text>
              Once editing is finished, the formula is parsed, evaluated, and
              the updated value is displayed in the cell.
            </Text>
          </li>
          <li>
            <Text>
              Any cells that depend on the edited cell must also be
              recalculated, with this process continuing until no further
              changes occur (change propagation).
            </Text>
          </li>
          <li>
            <Text>
              Recalculate only the cells that depend on other cells with changed
              values, not the entire spreadsheet.
            </Text>
          </li>
        </ul>
      </Flex>

      <Heading size="6" mt="8" mb="3" as="h2" className="scroll-mt-16">
        Thoughts
      </Heading>

      <Text mb="4" as="p" size="3">
        One of the standout features of the spreadsheet is the support for
        formulas, which are central to the functionality of any spreadsheet
        application. In this application, formulas begin with an{' '}
        <Code>&quot;=&quot;</Code> sign and can reference other cell values as
        part of mathematical expressions, utilizing operators like{' '}
        <Code>+</Code>, <Code>-</Code>, <Code>*</Code>, and
        <Code>/</Code>. For example, if cell <Em>A1</Em> contains the value{' '}
        <Code>5</Code>, setting cell <Em>A2</Em> to <Code>=A1*2</Code> would
        display <Code>10</Code> in <Em>A2</Em>. If the value in <Em>A1</Em> is
        later updated to <Code>20</Code>, <Em>A2</Em> automatically updates to{' '}
        <Code>20</Code>. This is a core concept of <Strong>reactivity</Strong>,
        where changes in one part of the system propagate automatically to
        dependent parts.
      </Text>

      <Text mb="4" as="p" size="3">
        I utilized a <Strong>graph data structure</Strong> to track dependencies
        between cells. This structure makes it possible to efficiently handle
        updates, ensuring that when one cell changes, only the cells dependent
        on that change are recalculated. However, if there are{' '}
        <Strong>cyclic dependencies</Strong> (e.g., cells referencing each other
        in a loop), an <Strong>ERROR</Strong> message is displayed in the
        relevant cells. An <Strong>ERROR</Strong> message also gets displayed on
        an invalid mathematical expression.
      </Text>

      <Text mb="1" as="p" size="3">
        The overall behavior of the spreadsheet mimics popular applications. It
        supports:
      </Text>

      <Flex asChild direction="column" gap="1" pl="4">
        <ul className="mb-5 [list-style-type:circle]">
          <li>
            <Text>
              Editing cells by either double-clicking or pressing{' '}
              <Kbd>Enter</Kbd> or <Kbd>F2</Kbd>.
            </Text>
          </li>
          <li>
            <Text>Navigating between cells with the arrow keys.</Text>
          </li>
          <li>
            <Text>
              When editing, pressing <Kbd>Escape</Kbd> cancels the input and
              restores the original cell content.
            </Text>
          </li>
          <li>
            <Text>
              When editing, pressing <Kbd>Enter</Kbd> makes changes and focus on
              the row below.
            </Text>
          </li>
          <li>
            <Text>
              When editing, pressing <Kbd>Tab</Kbd> makes changes and focuses on
              the column to the right.
            </Text>
          </li>
          <li>
            <Text>
              The row and column headers of the focused cell are highlighted to
              indicate its selection.
            </Text>
          </li>
        </ul>
      </Flex>

      <Text mb="4" as="p" size="3">
        A key design choice was making the spreadsheet component{' '}
        <Strong>headless</Strong>, meaning it doesn’t impose any particular
        styling. Instead, the consumer of the component provides the necessary
        styles, labels, and behaviors using a{' '}
        <Link href="https://react.dev/reference/react/Children#calling-a-render-prop-to-customize-rendering">
          render prop pattern
        </Link>{' '}
        as recommended by the React documentation. This approach keeps the
        spreadsheet flexible and reusable in different contexts.
      </Text>

      <Text mb="4" as="p" size="3">
        During development, I encountered some performance issues with cell
        re-renders. Every time an update was made, all cells would re-render,
        leading to sluggish performance in larger spreadsheets. By utilizing the
        React Profiler in{' '}
        <Link href="https://react.dev/learn/react-developer-tools">
          React dev tools
        </Link>
        , I was able to identify the problem areas and apply memoization
        techniques to reduce unnecessary re-renders. This significantly improved
        performance, ensuring that only the cells affected by a change were
        re-rendered, keeping the application responsive even with many cells.
      </Text>

      <Text mb="4" as="p" size="3">
        As a followup, for larger spreadsheets use virtualization with{' '}
        <Link href="https://github.com/bvaughn/react-virtualized">
          react-virtialized
        </Link>
        ,{' '}
        <Link href="https://github.com/bvaughn/react-window">react-window</Link>
        , or{' '}
        <Link href="https://tanstack.com/virtual/latest">
          @tanstack/react-virtual
        </Link>
      </Text>

      <Text mb="4" as="p" size="3">
        The{' '}
        <Link href="https://www.youtube.com/watch?v=AdNJ3fydeao">
          first talk
        </Link>{' '}
        of Svelte (framework) was about spreadsheets.
      </Text>

      <Text mb="4" as="p" size="3">
        <Link href="https://react.dev/reference/react/memo">
          https://react.dev/reference/react/memo
        </Link>
      </Text>

      <Text mb="4" as="p" size="3">
        <Link href="https://react.dev/reference/react/Profiler">
          https://react.dev/reference/react/Profiler
        </Link>
      </Text>
    </>
  )
}
