import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { LoadingSpinner } from "./LoadingSpinner.jsx";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen label="Checking your workspace" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
