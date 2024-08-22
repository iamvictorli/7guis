import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

import ErrorPage from "./error-page";
import Root from "./routes/root";
import Counter from "./routes/counter";
import TemperatureConverter from "./routes/temperature-converter";
import FlightBooker from "./routes/flight-booker";
import Timer from "./routes/timer";
import CRUD from "./routes/crud";
import CircleDrawer from "./routes/circle-drawer";
import Cells from "./routes/cells";
import "./index.css";

import { store } from "./store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/counter",
        element: <Counter />,
      },
      {
        path: "/temperature-converter",
        element: <TemperatureConverter />,
      },
      {
        path: "/flight-booker",
        element: <FlightBooker />,
      },
      {
        path: "/timer",
        element: <Timer />,
      },
      {
        path: "/crud",
        element: <CRUD />,
      },
      {
        path: "/circle-drawer",
        element: <CircleDrawer />,
      },
      {
        path: "/cells",
        element: <Cells />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
