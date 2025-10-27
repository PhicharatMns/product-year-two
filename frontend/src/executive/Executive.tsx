import Sidebarexecutive from "@/component/Sidebarexecutive";
import { Outlet } from "react-router-dom";

export default function Executive() {
  return (
    <div className="flex">
      <div className="lg:w-64">
        <Sidebarexecutive />
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
