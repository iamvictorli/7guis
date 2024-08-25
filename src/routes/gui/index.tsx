import { cn } from '~/lib/utils'
import React from 'react'
import { NavLink, useParams } from 'react-router-dom'

import Cells from './cells'
import CircleDrawer from './circle-drawer'
import Counter from './counter'
import CRUD from './crud'
import FlightBooker from './flight-booker'
import TemperatureConverter from './temperature-converter'
import Timer from './timer'

const navLinks = [
  {
    title: 'Counter',
    to: '/counter',
  },
  {
    title: 'Temperature Converter',
    to: '/temperature-converter',
  },
  {
    title: 'Flight Booker',
    to: '/flight-booker',
  },
  {
    title: 'Timer',
    to: '/timer',
  },
  {
    title: 'CRUD',
    to: '/crud',
  },
  {
    title: 'Circle Drawer',
    to: '/circle-drawer',
  },
  {
    title: 'Cells',
    to: '/cells',
  },
]

function Nav() {
  return (
    <nav>
      {navLinks.map(({ to, title }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => {
            return cn(isActive ? 'text-blue-600 underline' : '', 'px-4 py-6')
          }}>
          {title}
        </NavLink>
      ))}
    </nav>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
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
