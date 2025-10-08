import { Outlet } from "react-router-dom";
import Sidebaradmin from "../component/sidebaradmin";

export default function AdminLayout() {
  return (
    <div className="flex">
      {/* ✅ Sidebar (fix width) */}
      <div className="lg:w-64 ">
        <Sidebaradmin />
      </div>

      <div className="flex-1  ">
        <Outlet />
      </div>
    </div>
  );
}
