import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, user }) {
  if (!user || !user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
