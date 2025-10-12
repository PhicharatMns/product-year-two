// src/App.js
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Admin 
import Searchpastjobs from "./Admin/Searchpastjobs";
import Editacc from "./Admin/Editacc";
import AdminLayout from "./Admin/AdminLayout";
import Login from "./sighup/Login";
import Details from "./Admin/Details";
import EmployeeList from "./EmployeeList";
import AddEmployee from "./AddEmployee";
import Profileadmin from "./Admin/Profileadmin";
import Addwork from "./Admin/Addwork";
import Dashboard from "./Admin/Dashboard";
import Notification from "./Admin/Notification";

// User Worker
import DashboardUser from "./User/DashboardUser";
import Profile from "./User/Profile";
import UserLayout from "./User/UserLayout";
import GetPaper from "./User/GetPaper";
import Box from "./User/Box";

// color theme web A
import { ThemeProvider } from "@/components/theme-provider";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/logins" replace /> },
  { path: "/logins", element: <Login /> },

  {
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
    ],
  },

{
  path: "/User",
  element: <UserLayout />,
  children: [
    { path: "Dashboard", element: <DashboardUser /> }, 
    { path: "Profile", element: <Profile /> },       
    { path: "Getpaper", element: <GetPaper /> },     
    { path: "Box", element: <Box /> },                
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
