import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { Expenses } from "./pages/expenses";

const router = createBrowserRouter([
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
