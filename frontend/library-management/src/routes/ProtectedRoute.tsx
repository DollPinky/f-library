import { useAuth } from "@/hooks/useAuth";

import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  requiredRole?: string;
}

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { accessToken, user } = useAuth();
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to={"/login"} state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    const redirectPath = user?.role === "admin" ? "/admin" : "/user";
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
