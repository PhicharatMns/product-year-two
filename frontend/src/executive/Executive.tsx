import Sidebar from "@/component/sidebar";
import { Outlet } from "react-router-dom";

export default function Executive() {
  return (
    <div className="flex min-h-screen">
      <div className="lg-w-64">
        {/* <Sidebar /> */}</div>

      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}
