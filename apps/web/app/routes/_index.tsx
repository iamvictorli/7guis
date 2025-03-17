import { GitHubLogoIcon } from '@radix-ui/react-icons'
import {
  Blockquote,
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Link,
  Section,
  Text,
  Tooltip,
} from '@radix-ui/themes'
import { Link as RRDLink } from 'react-router'

import { navLinks } from '~/shared/links'

export default function Index() {
  return (
    <main>
      <Container size="2" px={{ initial: '5', sm: '0' }}>
        <Section size={{ initial: '1', sm: '2' }}>
          <Section size={{ initial: '1', sm: '2' }}>
            <Heading size={{ initial: '8', sm: '9' }} weight="bold">
              7GUIs
            </Heading>

            <Box height={{ initial: '16px', sm: '24px' }} />

            <Flex
              align="center"
              gap={{ initial: '2', sm: '3' }}
              // eslint-disable-next-line tailwindcss/no-unnecessary-arbitrary-value
              className="border-y border-[#e5e7eb] px-1 py-2"
            >
              <Tooltip content="View Github">
                <Link
                  href="https://github.com/iamvictorli/7gui"
                  aria-label="View Github"
                >
                  <IconButton asChild variant="ghost" highContrast size="2">
                    <GitHubLogoIcon width="24" height="24" />
                  </IconButton>
                </Link>
              </Tooltip>
              <Link
                size={{ initial: '2', sm: '3' }}
                href="https://www.linkedin.com/in/iamvictorli"
              >
                Victor Li
              </Link>
            </Flex>
          </Section>

          <Blockquote
            weight="regular"
            size={{ initial: '4', sm: '5' }}
            color="gray"
            className="italic"
          >
            There are countless GUI toolkits in different languages and with
            diverse approaches to GUI development. Yet, diligent comparisons
            between them are rare. Whereas in a traditional benchmark competing
            implementations are compared in terms of their resource consumption,
            here implementations are compared in terms of their notation. To
            that end, 7GUIs defines
            {' '}
            <Link
              href="https://eugenkiss.github.io/7guis/tasks"
              weight="medium"
            >
              seven tasks
            </Link>
            {' '}
            that represent typical challenges in GUI programming. In addition,
            7GUIs provides a recommended set of
            {' '}
            <Link
              href="https://eugenkiss.github.io/7guis/dimensions"
              weight="medium"
            >
              evaluation dimensions
            </Link>
            .
          </Blockquote>

          <Section size="2">
            <Heading size={{ initial: '5', sm: '6' }} weight="bold" as="h2">
              Goals:
            </Heading>
            <Box height={{ initial: '28px', sm: '32px' }} />
            <Text size={{ initial: '4', sm: '5' }}>
              My implementation uses modern Redux with
              {' '}
              <Link href="https://redux-toolkit.js.org/">Redux Toolkit</Link>
              .
              Additionally, contemporary tools such as
              {' '}
              <Link href="https://vitejs.dev/">Vite</Link>
              ,
              {' '}
              <Link href="https://vitest.dev/">Vitest</Link>
              ,
              {' '}
              <Link href="https://tailwindcss.com/">Tailwind</Link>
              ,
              {' '}
              <Link href="https://www.radix-ui.com/">Radix UI</Link>
              , and
              {' '}
              <Link href="https://testing-library.com/docs/react-testing-library/intro/">
                React Testing Library
              </Link>
              {' '}
              were used to enhance the development process.
            </Text>
          </Section>

          <Heading size={{ initial: '5', sm: '6' }} weight="bold" as="h2">
            GUIs:
          </Heading>

          <Section size={{ initial: '1', sm: '2' }}>
            <ul className="flex list-inside list-decimal flex-col gap-4 text-xl">
              {navLinks.map(({ to, title }) => (
                <li key={to}>
                  <Link asChild size={{ initial: '4', sm: '5' }}>
                    <RRDLink to={to}>{title}</RRDLink>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        </Section>
      </Container>
    </main>
  )
}
