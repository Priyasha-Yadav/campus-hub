import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/useAuthContext";

export default function ProtectedRoute() {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
