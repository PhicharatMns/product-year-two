// import { Navigate } from "react-router-dom";

// interface Props {
//   children: React.ReactNode;
//   allowedRoles: string[];
// }

// export default function PrivateRoute({ children, allowedRoles }: Props) {
//   const role = localStorage.getItem("role");

//   if (!role || !allowedRoles.includes(role)) {
//     return <Navigate to="/logins" replace />;
//   }

//   return <>{children}</>;
// }
