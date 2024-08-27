import { Theme } from '@radix-ui/themes'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

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

import './index.css'

import { store } from './store'

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        index: true,
        element: <Index />,
        errorElement: <ErrorPage />,
      },
      {
        element: <GUI />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: 'counter',
            element: <Counter />,
            errorElement: <ErrorPage />,
          },
          {
            path: 'temperature-converter',
            element: <TemperatureConverter />,
            errorElement: <ErrorPage />,
          },
          {
            path: 'flight-booker',
            element: <FlightBooker />,
            errorElement: <ErrorPage />,
          },
          {
            path: 'timer',
            element: <Timer />,
            errorElement: <ErrorPage />,
          },
          {
            path: 'crud',
            element: <CRUD />,
            errorElement: <ErrorPage />,
          },
          {
            path: 'circle-drawer',
            element: <CircleDrawer />,
            errorElement: <ErrorPage />,
          },
          {
            path: 'cells',
            element: <Cells />,
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
