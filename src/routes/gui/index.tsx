import { Box, Flex } from '@radix-ui/themes'
import { routes } from '~/shared/links'
import React from 'react'
import { useParams } from 'react-router-dom'

import { DocsNav } from 'components/docs-nav'
import { GUIMobileMenu } from 'components/gui-mobile-menu'
import { Header } from 'components/header'
import { MobileMenuProvider } from 'components/mobile-menu'
import { SideNav } from 'components/side-nav'

import Cells from './cells'
import CircleDrawer from './circle-drawer'
import Counter from './counter'
import CRUD from './crud'
import FlightBooker from './flight-booker'
import TemperatureConverter from './temperature-converter'
import Timer from './timer'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MobileMenuProvider>
        <Header />
        <GUIMobileMenu />
      </MobileMenuProvider>

      <Flex>
        <SideNav>
          <Box pt="4" px="3" pb="9">
            <DocsNav routes={routes} />
          </Box>
        </SideNav>
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
