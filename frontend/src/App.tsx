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
import Profileadmin from "./Admin/Profileadmin";
import Notification from "./Admin/Notification";
import SuppliesAdmin from "./Admin/SuppliesAdmin";
import MessagerAdmin from "./Admin/MessagerAdmin";

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
import Usermesseger from "./User/Usermesseger";

// Auth
import Login from "./sighup/Login";
import Register from "./sighup/Register";
import ProtectedRoute from "./sighup/ProtectedRoute";

// Xexcutive
import DashboardExecutive from "./executive/DashboardExecutive";
import Executive from "./executive/Executive";
import MapWork from "./executive/MapWork";
import Getpaperexecutive from "./executive/Getpaperexecutive";
import ProfileExecutive from "./executive/ProfileExecutive";
import Team from "./executive/Team";

// userChief
import Dashboardchief from "./chief/Dashboardchief";
import Chief from "./chief/Chief";
// import Detailwork from "./User/Detailwork";
import CalendarChief from "./chief/CalendarChief";
import DetailworkChief from "./chief/DetailworkChief";
import ItemChief from "./chief/ItemChief";
import Messeger from "./chief/Messeger";
import EditUser from "./chief/EditUser";
import ProfileChief from "./chief/ProfileChief";
import GetPaper from "./chief/getpaper";
import PFD from "./Admin/PDF";


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
      // { path: "addemployee", element: <AddEmployee /> },
      { path: "profileadmin", element: <Profileadmin /> },
      // { path: "addwork", element: <Addwork /> },
      { path: "notification", element: <Notification /> },
      { path: "suppliesAdmin", element: <SuppliesAdmin /> },
      { path: "MessagerAdmin", element: <MessagerAdmin /> },
      { path : 'PFD' ,element : <PFD/>}

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
      { path: "Followtheprogress", element: <Followtheprogress /> },
      { path: "DetailItem", element: <DetailItem /> },
      { path: "usermesseger", element: <Usermesseger /> },
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
      { path: "ProfileExecutive", element: <ProfileExecutive /> },
      { path: "Team", element: <Team /> },
      // {path: "Messeger", element: <Messeger />},
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
    children: [
      { path: "Dashboardchief", element: <Dashboardchief /> },
      { path: "GetPaper", element: <GetPaper /> },
      { path: "CalendarChief", element: <CalendarChief /> },
      { path: "DetailworkChief/:id", element: <DetailworkChief /> },
      { path: "ItemChief", element: <ItemChief /> },
      { path: "messeger", element: <Messeger /> },
      { path: "edituser", element: <EditUser /> },
      { path: "ProfileChief", element: <ProfileChief /> },
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
