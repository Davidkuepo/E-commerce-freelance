import { Outlet, Navigate } from "react-router";
import { useSession } from "@/context/useSession/SessionContext";

export default function ProtectedRoute() {
  const session = useSession();

  if (session.userInfo.token) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
}
