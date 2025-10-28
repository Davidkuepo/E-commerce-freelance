import { Outlet, Navigate } from "react-router";
import { useAuth } from "@/context/useAuth/AuthContext.tsx";

export default function ProtectedRoute() {
  const session = useAuth();

  if (session.userInfo.token) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
}
