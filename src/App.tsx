import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { Expenses } from "./pages/expenses";
import { Settings } from "./pages/settings";
import { Login } from "./pages/login";
import { Register } from "./pages/register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/expenses",
    element: <Expenses />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
]);

export { router };
