// src/Admin/AdminLayout.js
import { Outlet } from "react-router-dom";
import Sidebaradmin from "../component/sidebaradmin";

export default function AdminLayout() {
  return (
    <div className="flex">
      {/* ✅ Sidebar กำหนดความกว้างชัดเจน */}
      <Sidebaradmin  />

      {/* ✅ ส่วนเนื้อหา ขยับออกจาก Sidebar */}
      <div className="flex-1 ml-61">
        <Outlet />
      </div>
    </div>
  );
}
