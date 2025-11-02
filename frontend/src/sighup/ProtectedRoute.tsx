import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token"); // เก็บ token
  const role = localStorage.getItem("role"); // เก็บ role

  // ถ้าไม่มี token กลับ login
  if (!token) return <Navigate to="/logins" replace />;

  // map สำหรับ redirect ตาม role
  const roleRedirectMap: Record<string, string> = {
    admin: "/dashboard",
    user: "/user/DashboardUser",
    chief: "/chief/Dashboard",
    executive: "/executive/Dashboard",
  };

  // ถ้า role ไม่ตรง allowedRoles ให้ redirect ตาม role
  if (allowedRoles && !allowedRoles.includes(role || "")) {
    const redirectTo = roleRedirectMap[role || ""] || "/logins";
    return <Navigate to={redirectTo} replace />;
  }

  // ผ่านทุกเงื่อนไข render children
  return <>{children}</>;
}
