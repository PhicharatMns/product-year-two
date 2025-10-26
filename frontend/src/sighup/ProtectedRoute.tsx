// src/sighup/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token"); //เก้บ token
  const role = localStorage.getItem("role"); // เก็บ total

  // ถ้าไม่มี token  กลับ login
  if (!token) return <Navigate to="/logins" replace />;

  // ถ้า role ไม่ตรง  redirect ตาม role
  if (allowedRoles && !allowedRoles.includes(role || "")) {
    const redirectTo = role === "admin" ? "/dashboard" : "/user/DashboardUser";
    return <Navigate to={redirectTo} replace />;
  }

  // ผ่านทุกเงื่อนไข render children
  return children;
}
