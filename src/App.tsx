import { createBrowserRouter, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { Expenses } from "./pages/expenses";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/expenses",
    element: <Expenses />,
  },
]);

export { router };
