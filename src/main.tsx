import { Theme } from '@radix-ui/themes'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ErrorPage from './routes/error-page'

import './index.css'

import { store } from './store'

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        index: true,
        lazy: async function () {
          const { default: Index } = await import('./routes/_index')
          return { Component: Index }
        },
        errorElement: <ErrorPage />,
      },
      {
        lazy: async function () {
          const { default: GUI } = await import('./routes/_gui')
          return { Component: GUI }
        },
        errorElement: <ErrorPage />,
        children: [
          {
            path: 'counter',
            lazy: async function () {
              const { default: Counter } = await import('./routes/_gui.counter')
              return { Component: Counter }
            },
            errorElement: <ErrorPage />,
          },
          {
            path: 'temperature-converter',
            lazy: async function () {
              const { default: TemperatureConverter } = await import(
                './routes/_gui.temperature-converter'
              )
              return { Component: TemperatureConverter }
            },
            errorElement: <ErrorPage />,
          },
          {
            path: 'flight-booker',
            lazy: async function () {
              const { default: FlightBooker } = await import(
                './routes/_gui.flight-booker'
              )
              return { Component: FlightBooker }
            },
            errorElement: <ErrorPage />,
          },
          {
            path: 'timer',
            lazy: async function () {
              const { default: Timer } = await import('./routes/_gui.timer')
              return { Component: Timer }
            },
            errorElement: <ErrorPage />,
          },
          {
            path: 'crud',
            lazy: async function () {
              const { default: CRUD } = await import('./routes/_gui.crud')
              return { Component: CRUD }
            },
            errorElement: <ErrorPage />,
          },
          {
            path: 'circle-drawer',
            lazy: async function () {
              const { default: CircleDrawer } = await import(
                './routes/_gui.circle-drawer'
              )
              return { Component: CircleDrawer }
            },
            errorElement: <ErrorPage />,
          },
          {
            path: 'cells',
            lazy: async function () {
              const { default: Cells } = await import('./routes/_gui.cells')
              return { Component: Cells }
            },
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
