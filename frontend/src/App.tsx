// src/App.tsx
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

// Admin
import AdminLayout from "./Admin/AdminLayout";
import Dashboard from "./Admin/Dashboard";
import Editacc from "./Admin/Editacc";
import Searchpastjobs from "./Admin/Searchpastjobs";
import Details from "./Admin/Details";
import EmployeeList from "./EmployeeList";
import AddEmployee from "./AddEmployee";
import Profileadmin from "./Admin/Profileadmin";
import Addwork from "./Admin/Addwork";
import Notification from "./Admin/Notification";
import SuppliesAdmin from "./Admin/SuppliesAdmin";

// User Worker
import UserLayout from "./User/UserLayout";
import Profile from "./User/Profile";
import GetPaper from "./User/GetPaper";
import Box from "./User/Box";
import Maps from "./User/Maps";
import Suppiles from "./User/Supplies";

// Auth
import Login from "./sighup/Login";
import DashboardUser from "./User/DashboardUser";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/logins" replace /> },
  { path: "/logins", element: <Login /> },

  // Admin Routes
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "editacc", element: <Editacc /> },
      { path: "searchpastjobs", element: <Searchpastjobs /> },
      { path: "details/:id", element: <Details /> },
      { path: "employeelist", element: <EmployeeList /> },
      { path: "addemployee", element: <AddEmployee /> },
      { path: "profileadmin", element: <Profileadmin /> },
      { path: "addwork", element: <Addwork /> },
      { path: "notification", element: <Notification /> },
      { path: "suppliesAdmin", element: <SuppliesAdmin /> },

    ],
  },

  // User Routes
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      { path: "DashboardUser", element: <DashboardUser /> },
      { path: "profile", element: <Profile /> },
      { path: "getpaper", element: <GetPaper /> },
      { path: "box", element: <Box /> },
      { path: "maps", element: <Maps /> },
      { path: "supplies", element: <Suppiles /> },

    ],
  },
]);

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
