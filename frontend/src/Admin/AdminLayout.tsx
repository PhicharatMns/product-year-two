import { Outlet } from "react-router-dom";
import Sidebaradmin from "../component/sidebaradmin";

export default function AdminLayout() {
  return (
    <div className="flex">
      {/* ✅ Sidebar */}
      <Sidebaradmin />

      {/* ✅ เนื้อหา (ขยับออกจาก Sidebar) */}
      <div className="flex-1 lg:ml-60 ">
        <Outlet />
      </div>
    </div>
  );
}
