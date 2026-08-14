import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { Expenses } from "./pages/expenses";
import { Settings } from "./pages/settings";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Private } from "./routes/private";

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
    element: (
      <Private>
        <Dashboard />
      </Private>
    ),
  },
  {
    path: "/expenses",
    element: (
      <Private>
        <Expenses />
      </Private>
    ),
  },
  {
    path: "/settings",
    element: (
      <Private>
        <Settings />
      </Private>
    ),
  },
]);

export { router };
