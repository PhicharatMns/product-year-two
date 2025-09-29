// src/Admin/AdminLayout.js
import { Outlet } from "react-router-dom";
import Sidebaradmin from "../component/Sidebaradmin";

export default function AdminLayout() {
  return (
    <div className="flex">
      <Sidebaradmin /> {/* ✅ Navbar ของฝั่ง Admin */}
      <div className="flex-1 ">
        <Outlet /> {/* ✅ เนื้อหาแต่ละหน้าของ Admin */}
      </div>
    </div>
  );
}
