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
import { navLinks } from '~/shared/links'
import { Link as RRDLink } from 'react-router-dom'

export default function Index() {
  return (
    <main>
      <Flex justify="center">
        <Container size="2" mx="5">
          <Section size={{ initial: '1', sm: '2' }}>
            <Heading size={{ initial: '8', sm: '9' }} weight="bold">
              7GUIs
            </Heading>

            <Box height={{ initial: '16px', sm: '24px' }} />

            <Flex
              align="center"
              gap={{ initial: '2', sm: '3' }}
              className="border-y border-solid px-1 py-2">
              <Tooltip content="View Github">
                <IconButton asChild variant="ghost" highContrast size="2">
                  <Link href="https://github.com/iamvictorli/7gui">
                    <GitHubLogoIcon width="24" height="24" />
                  </Link>
                </IconButton>
              </Tooltip>
              <Link
                size={{ initial: '2', sm: '3' }}
                href="https://www.linkedin.com/in/iamvictorli">
                Victor Li
              </Link>
            </Flex>
          </Section>

          {/* TODO: would adding padding here remove the box? */}
          <Box maxWidth={{ initial: '350px', sm: '688px' }}>
            <Blockquote
              ml={{ sm: '-4' }}
              highContrast={false}
              weight="regular"
              size={{ initial: '4', sm: '5' }}
              color="gray"
              className="italic">
              There are countless GUI toolkits in different languages and with
              diverse approaches to GUI development. Yet, diligent comparisons
              between them are rare. Whereas in a traditional benchmark
              competing implementations are compared in terms of their resource
              consumption, here implementations are compared in terms of their
              notation. To that end, 7GUIs defines{' '}
              <Link
                href="https://eugenkiss.github.io/7guis/tasks"
                weight="medium">
                seven tasks
              </Link>{' '}
              that represent typical challenges in GUI programming. In addition,
              7GUIs provides a recommended set of{' '}
              <Link
                href="https://eugenkiss.github.io/7guis/dimensions"
                weight="medium">
                evaluation dimensions
              </Link>
              .
            </Blockquote>
          </Box>

          <Section size="2">
            <Heading size={{ initial: '5', sm: '6' }} weight="bold" as="h3">
              Goals:
            </Heading>
            <Box height={{ initial: '28px', sm: '32px' }} />
            <Box maxWidth={{ initial: '350px', sm: '688px' }}>
              <Text size={{ initial: '4', sm: '5' }}>
                My implementation uses modern Redux with{' '}
                <Link href="https://redux-toolkit.js.org/">Redux Toolkit</Link>.
                Additionally, contemporary tools such as{' '}
                <Link href="https://vitejs.dev/">Vite</Link>,{' '}
                <Link href="https://vitest.dev/">Vitest</Link>,{' '}
                <Link href="https://tailwindcss.com/">Tailwind</Link>,{' '}
                <Link href="https://www.radix-ui.com/">Radix UI</Link>, and{' '}
                <Link href="https://testing-library.com/docs/react-testing-library/intro/">
                  React Testing Library
                </Link>{' '}
                were used to enhance the development process.
              </Text>
            </Box>
          </Section>

          <Heading size={{ initial: '5', sm: '6' }} weight="bold" as="h3">
            GUIs:
          </Heading>

          <Section size={{ initial: '1', sm: '2' }}>
            <ul className="flex list-inside list-disc flex-col gap-4 text-xl marker:text-[var(--indigo-a11)]">
              {navLinks.map(({ to, title }) => (
                <li
                  key={to}
                  className="underline decoration-[var(--indigo-a11)] underline-offset-[calc(0.025em+2px)]">
                  <Link asChild size={{ initial: '4', sm: '5' }}>
                    <RRDLink to={to}>{title}</RRDLink>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        </Container>
      </Flex>
    </main>
  )
}
