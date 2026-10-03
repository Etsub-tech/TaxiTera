import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
  const { user } = useAuth();

  // If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If logged in → render the child route (Outlet)
  return <Outlet />;
}
