import { Theme } from '@radix-ui/themes'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { GuiSkeleton, IndexSkeleton } from '~/components/Skeleton'

import './index.css'
import GUI from './routes/_gui'
import Cells from './routes/_gui.cells'
import CircleDrawer from './routes/_gui.circle-drawer'
import Counter from './routes/_gui.counter'
import CRUD from './routes/_gui.crud'
import FlightBooker from './routes/_gui.flight-booker'
import TemperatureConverter from './routes/_gui.temperature-converter'
import Timer from './routes/_gui.timer'
import Index from './routes/_index'
import ErrorPage from './routes/error-page'
import { store } from './store'

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        index: true,
        HydrateFallback: IndexSkeleton,
        Component: Index,
        errorElement: <ErrorPage />,
      },
      {
        Component: GUI,
        errorElement: <ErrorPage />,
        children: [
          {
            path: 'counter',
            HydrateFallback: GuiSkeleton,
            Component: Counter,
            errorElement: <ErrorPage />,
          },
          {
            path: 'temperature-converter',
            HydrateFallback: GuiSkeleton,
            Component: TemperatureConverter,
            errorElement: <ErrorPage />,
          },
          {
            path: 'flight-booker',
            HydrateFallback: GuiSkeleton,
            Component: FlightBooker,
            errorElement: <ErrorPage />,
          },
          {
            path: 'timer',
            HydrateFallback: GuiSkeleton,
            Component: Timer,
            errorElement: <ErrorPage />,
          },
          {
            path: 'crud',
            HydrateFallback: GuiSkeleton,
            Component: CRUD,
            errorElement: <ErrorPage />,
          },
          {
            path: 'circle-drawer',
            HydrateFallback: GuiSkeleton,
            Component: CircleDrawer,
            errorElement: <ErrorPage />,
          },
          {
            path: 'cells',
            HydrateFallback: GuiSkeleton,
            Component: Cells,
            errorElement: <ErrorPage />,
          },
        ],
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </Theme>
  </StrictMode>,
)
