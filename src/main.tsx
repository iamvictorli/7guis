import { Theme } from '@radix-ui/themes'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import GUI from './routes/_gui'
import ErrorPage from './routes/error-page'

import './index.css'

import { GuiSkeleton, IndexSkeleton } from 'components/Skeleton'

import {
  Cells,
  CircleDrawer,
  Counter,
  CRUD,
  FlightBooker,
  Index,
  TemperatureConverter,
  Timer,
} from './routes'
import { store } from './store'

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<IndexSkeleton />}>
            <Index />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
      {
        element: <GUI />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: 'counter',
            element: (
              <Suspense fallback={<GuiSkeleton />}>
                <Counter />
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'temperature-converter',
            element: (
              <Suspense fallback={<GuiSkeleton />}>
                <TemperatureConverter />
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'flight-booker',
            element: (
              <Suspense fallback={<GuiSkeleton />}>
                <FlightBooker />
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'timer',
            element: (
              <Suspense fallback={<GuiSkeleton />}>
                <Timer />
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'crud',
            element: (
              <Suspense fallback={<GuiSkeleton />}>
                <CRUD />
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'circle-drawer',
            element: (
              <Suspense fallback={<GuiSkeleton />}>
                <CircleDrawer />
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'cells',
            element: (
              <Suspense fallback={<GuiSkeleton />}>
                <Cells />
              </Suspense>
            ),
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
