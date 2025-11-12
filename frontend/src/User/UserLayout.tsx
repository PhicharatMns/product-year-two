// src/User/UserLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../component/sidebar";

export default function UserLayout() {
  return (
    <div className="flex min-h-screen">

      <div className="lg:w-64">
        <Sidebar />
      </div>


      <div className="flex-1 ">
        <Outlet />
      </div>
    </div>
  );
}
