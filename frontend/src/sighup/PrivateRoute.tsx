import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/login/check", {
          method: "GET",
          credentials: "include",
        });
        console.log("CheckAuth status:", res.status);
        if (res.status === 200) setAuthenticated(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <div>กำลังตรวจสอบ...</div>;
  if (!authenticated) return <Navigate to="/logins" replace />;

  return <>{children}</>;
};

export default PrivateRoute;
