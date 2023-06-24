import { createBrowserRouter } from "react-router-dom";
import { Create, Home } from "./pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/create",
    element: <Create />,
  },
]);
