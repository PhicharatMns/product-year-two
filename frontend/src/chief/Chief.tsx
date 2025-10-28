import SidebarChief from "@/component/SidebarChief";
import { Outlet } from "react-router-dom";

export default function Chief() {
    return (
        <div className="flex">
            <div className="lg:w-64">
                <SidebarChief />
            </div>

            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    )
}