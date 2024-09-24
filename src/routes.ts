import { lazy } from 'react'

export const Index = lazy(() => import('./routes/_index'))
export const Cells = lazy(() => import('./routes/_gui.cells'))
export const CircleDrawer = lazy(() => import('./routes/_gui.circle-drawer'))
export const CRUD = lazy(() => import('./routes/_gui.crud'))
export const FlightBooker = lazy(() => import('./routes/_gui.flight-booker'))
export const TemperatureConverter = lazy(
  () => import('./routes/_gui.temperature-converter'),
)
export const Timer = lazy(() => import('./routes/_gui.timer'))
export const Counter = lazy(() => import('./routes/_gui.counter'))
