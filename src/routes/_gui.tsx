import { Box, Flex, Section } from '@radix-ui/themes'
import { Header } from '~/components/Header'
import { routes } from '~/shared/links'
import { Outlet } from 'react-router-dom'

import { MobileMenuProvider } from 'components/MobileMenu'
import { MobileNav } from 'components/MobileNav'
import { Nav } from 'components/Nav'
import { Sidebar } from 'components/Sidebar'

export default function GUI() {
  return (
    <>
      {/* TODO: consolidate this to be one file with similar design MobileMenu.Root, etc... */}
      <MobileMenuProvider>
        <Header />
        <MobileNav />
      </MobileMenuProvider>

      <Flex>
        {/* TODO: should this be in same file? Sidebar Navigation */}
        <Sidebar>
          <Box pt="4" px="3" pb="9">
            <Nav routes={routes} />
          </Box>
        </Sidebar>
        <Flex justify="center" maxWidth="100%" flexGrow="1" asChild>
          <main>
            <Section
              width="100%"
              px={{ initial: '5', xs: '6', sm: '7', md: '9' }}
              size={{ initial: '2', sm: '4' }}
              className="max-w-4xl">
              <Outlet />
            </Section>
          </main>
        </Flex>
      </Flex>
    </>
  )
}
