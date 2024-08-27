import { Box, Flex } from '@radix-ui/themes'
import { Sidebar } from '~/components/Sidebar'
import { routes } from '~/shared/links'
import React from 'react'
import { useParams } from 'react-router-dom'

import Cells from 'components/guis/Cells'
import CircleDrawer from 'components/guis/CircleDrawer'
import Counter from 'components/guis/Counter'
import CRUD from 'components/guis/CRUD'
import FlightBooker from 'components/guis/FlightBooker'
import TemperatureConverter from 'components/guis/TemperatureConverter'
import Timer from 'components/guis/Timer'
import { Header } from 'components/Header'
import { MobileMenuProvider } from 'components/MobileMenu'
import { MobileNav } from 'components/MobileNav'
import { Nav } from 'components/Nav'

function Layout({ children }: { children: React.ReactNode }) {
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
        {/* TODO: main similar to radix docs */}
        <main>{children}</main>
      </Flex>
    </>
  )
}

function getGuiComponent(gui: string | undefined) {
  switch (gui) {
    case 'counter':
      return Counter
    case 'temperature-converter':
      return TemperatureConverter
    case 'flight-booker':
      return FlightBooker
    case 'timer':
      return Timer
    case 'crud':
      return CRUD
    case 'circle-drawer':
      return CircleDrawer
    case 'cells':
      return Cells
    default:
      throw new Error('Page does not exist')
  }
}

export default function GUI() {
  const { gui } = useParams()
  const Component = getGuiComponent(gui)
  return (
    <Layout>
      <Component />
    </Layout>
  )
}
