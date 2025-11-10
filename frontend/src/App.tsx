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
import MapAdmin from "./Admin/MapAdmin";

// User Worker
import UserLayout from "./User/UserLayout";
import Detailwork from "./User/Detailwork";
import Maps from "./User/Maps";
import Suppiles from "./User/Supplies";
import DashboardUser from "./User/DashboardUser";
import Getpaper from "./User/GetPaper";
import Calendars from "./User/Calendar";
import Withdraw from "./User/Withdraw";
import Followtheprogress from "./User/Followtheprogress";
import DetailItem from "./User/Detailitem";
import Profile from "./User/Profile";



// Auth
import Login from "./sighup/Login";
import Register from "./sighup/Register";
import ProtectedRoute from "./sighup/ProtectedRoute";

// Xexcutive
import DashboardExecutive from "./executive/DashboardExecutive";
import Executive from "./executive/Executive";
import MapWork from "./executive/MapWork";
import Getpaperexecutive from "./executive/Getpaperexecutive";

// userChief
import Dashboardchief from "./chief/Dashboardchief";
import Chief from "./chief/Chief";
// import Detailwork from "./User/Detailwork";
import CalendarChief from "./chief/CalendarChief";
import DetailworkChief from "./chief/DetailworkChief";
import GetPaper from "./chief/getpaper";

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
      { path: "mapadmin", element: <MapAdmin /> },
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
      { path: "Profile", element: <Profile /> },
      { path: "getpaper", element: <Getpaper /> },
      { path: "maps", element: <Maps /> },
      { path: "supplies", element: <Suppiles /> },
      { path: "Detailwork/:id", element: <Detailwork /> },
      { path: "Calendar", element: <Calendars /> },
      { path: "withdraw", element: <Withdraw /> },
      { path: 'Followtheprogress', element: <Followtheprogress /> },
      { path: "DetailItem", element: <DetailItem /> },
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
    children: [
      { path: "DashboardExecutive", element: <DashboardExecutive /> },
      { path: "getpaperexecutive", element: <Getpaperexecutive /> },
      { path: "MapWork", element: <MapWork /> },
    ],
  },

  //chief
  {
    path: "/chief",
    element: (
      <ProtectedRoute>
        <Chief />
      </ProtectedRoute>
    ),
    children: [{ path: "Dashboardchief", element: <Dashboardchief /> },
    { path: 'getpaper', element: <GetPaper /> },
    { path: 'CalendarChief', element: <CalendarChief /> },
    { path: "DetailworkChief/:id", element: <DetailworkChief /> },
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
