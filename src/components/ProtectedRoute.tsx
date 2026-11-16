import { Navigate, Outlet } from "react-router";
import type { AuthStatus } from "../types/auth";

type ProtectedRouteProps = {
  status: AuthStatus;
};

function ProtectedRoute({ status }: ProtectedRouteProps) {
  if (status === "loading") {
    return <p>Authentifizierung wird geprüft...</p>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }
  // handles authenticated status
  return <Outlet />;
}

export default ProtectedRoute;
