import { Theme } from '@radix-ui/themes'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ErrorPage from './routes/error-page'
import GUIPage from './routes/gui'
import Root from './routes/root'

import './index.css'

import { store } from './store'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/:gui',
    element: <GUIPage />,
    errorElement: <ErrorPage />,
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
