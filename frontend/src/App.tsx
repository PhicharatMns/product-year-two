// src/App.js
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Searchpastjobs from "./Admin/Searchpastjobs";
import Editacc from "./Admin/Editacc";
import AdminLayout from "./Admin/AdminLayout";
import Home from "./Admin/Home";
import Login from "./sighup/Login";
import Details from "./Admin/Details";
import EmployeeList from "./EmployeeList";
import AddEmployee from "./AddEmployee";
import Profileadmin from "./Admin/Profileadmin";
import Profile from "./Admin/Profile";
import Addwork from "./Admin/Addwork";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/logins" replace /> },
  { path: "/logins", element: <Login /> },
  {
    element: <AdminLayout />,
    children: [
      { path: "home", element: <Home /> },
      { path: "editacc", element: <Editacc /> },
      { path: "searchpastjobs", element: <Searchpastjobs /> },
      { path: "details/:id", element: <Details /> },
      { path: "EmployeeList", element: <EmployeeList /> },
      { path: "AddEmployee", element: <AddEmployee /> },
      { path: "Profile", element: <Profile /> },
      { path: "Profileadmin", element: <Profileadmin /> },
      { path: "Addwork", element: <Addwork /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
