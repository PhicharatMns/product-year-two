// src/App.js
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";


import Searchpastjobs from "./Admin/Searchpastjobs";
import Editacc from "./Admin/Editacc";
import AdminLayout from "./Admin/AdminLayout";
import Home from "./Admin/Home";
import Login from "./sighup/Login";
import Details from "./Admin/details";


const router = createBrowserRouter([

  { path: "/", element: <Navigate to="/logins" replace /> },
  { path: '/logins', element: <Login /> },


  {
    element: <AdminLayout />,
    children: [
      { path: "home", element: <Home /> },
      { path: "editacc", element: <Editacc /> },
      { path: "searchpastjobs", element: <Searchpastjobs /> },
      { path: 'details', element: <Details /> }
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
