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

// User Worker
import UserLayout from "./User/UserLayout";
import DashboardUser from "./User/DashboardUser";
import Profile from "./User/Profile";
import GetPaper from "./User/GetPaper";
import Box from "./User/Box";
import Maps from "./User/Maps";
// Auth
import Login from "./sighup/Login";
import Register from "./sighup/Register";
import PrivateRoute from "./sighup/PrivateRoute";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/logins" replace /> },
  { path: "/logins", element: <Login /> },
  { path: "/logins/Register", element: <Register /> },

  // Admin Routes
  {
    path: "/",
    element: (
      <PrivateRoute allowedRoles={["admin"]}>
        <AdminLayout />

      </PrivateRoute>
    ),
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
    ],
  },

  // User Routes
  {
    path: "/user",
    element: (
      <PrivateRoute allowedRoles={["user"]}>
        <UserLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "dashboard", element: <DashboardUser /> },
      { path: "profile", element: <Profile /> },
      { path: "getpaper", element: <GetPaper /> },
      { path: "box", element: <Box /> },
      { path: "Maps", element: <Maps /> },
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
