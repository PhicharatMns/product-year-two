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
import Maps from "./User/Maps";
import Suppiles from "./User/Supplies";
import DashboardUser from "./User/DashboardUser";
import Getpaper from "./User/GetPaper";
import Calendars from "./User/Calendar";
import Withdraw from "./User/Withdraw";
import Followtheprogress from "./User/Followtheprogress";

// Auth
import Login from "./sighup/Login";
import Register from "./sighup/Register";
import ProtectedRoute from "./sighup/ProtectedRoute";

// Xexcutive
import DashboardExecutive from "./executive/DashboardExecutive";
import Executive from "./executive/Executive";


// userChief 
import Dashboardchief from "./chief/Dashboardchief";
import Chief from "./chief/Chief";
import Getpaperexecutive from "./executive/getpaperexecutive";
import Detailwork from "./User/Detailwork";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/logins" replace /> },
  { path: "/logins", element: <Login /> },
  { path: "/Register", element: <Register /> },

  // Admin Routes
  {
    path: "/",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
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
      { path: "suppliesAdmin", element: <SuppliesAdmin /> },
    ],
  },

  // User Routes
  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "DashboardUser", element: <DashboardUser /> },
      { path: "profile", element: <Profile /> },
      { path: "getpaper", element: <Getpaper /> },
      { path: "maps", element: <Maps /> },
      { path: "supplies", element: <Suppiles /> },
      { path: "Detailwork", element: <Detailwork /> }, // ตรวจสอบชื่อ component ให้ตรง
      { path: "Calendar", element: <Calendars /> },
      { path: "withdraw", element: <Withdraw /> },
      { path: 'Followtheprogress', element: <Followtheprogress /> }
    ],
  },

  // xexcutive Router
  {
    path: "/executive",
    element: (
      <ProtectedRoute>
        <Executive />
      </ProtectedRoute>
    ),
    children: [{ path: "DashboardExecutive", element: <DashboardExecutive /> }
      , { path: 'getpaperexecutive', element: <Getpaperexecutive /> }],
  },

  //chief
  {
    path: '/chief', element: (
      <ProtectedRoute>
        <Chief />
      </ProtectedRoute>
    ),
    children: [
      { path: 'Dashboardchief', element: <Dashboardchief /> }
    ]
  }

]);

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
