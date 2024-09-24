import { Theme } from '@radix-ui/themes'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import GUI from './routes/_gui'
import ErrorPage from './routes/error-page'

import './index.css'

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
          <Suspense fallback={<div>Loading</div>}>
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
              <Suspense fallback={<div>Loading</div>}>
                <Counter />
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'temperature-converter',
            element: (
              <Suspense fallback={<div>Loading</div>}>
                <TemperatureConverter />
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'flight-booker',
            element: (
              <Suspense fallback={<div>Loading</div>}>
                <FlightBooker />
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'timer',
            element: (
              <Suspense fallback={<div>Loading</div>}>
                <Timer />
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'crud',
            element: (
              <Suspense fallback={<div>Loading</div>}>
                <CRUD />
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'circle-drawer',
            element: (
              <Suspense fallback={<div>Loading</div>}>
                <CircleDrawer />
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'cells',
            element: (
              <Suspense fallback={<div>Loading</div>}>
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
