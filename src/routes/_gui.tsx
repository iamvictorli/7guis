import { Box, Flex, ScrollArea, Section } from '@radix-ui/themes'
import { routes } from '~/shared/links'
import { Outlet } from 'react-router-dom'

import Header from 'components/Header'
import MobileMenu from 'components/MobileMenu'
import Nav from 'components/Nav'
import Sidebar from 'components/Sidebar'

function GuiHeader() {
  return (
    <MobileMenu.Root>
      {/* two headers
      1. Homepage
      2. When mobile menu is open */}
      <Header />

      <MobileMenu.Content>
        <Header />
        <ScrollArea>
          <Box pt="4" px="3" pb="9">
            <Nav routes={routes} />
          </Box>
        </ScrollArea>
      </MobileMenu.Content>
    </MobileMenu.Root>
  )
}

export default function GUI() {
  return (
    <>
      <GuiHeader />
      <Flex>
        {/* Sidebar navigation */}
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
