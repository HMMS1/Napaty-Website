import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // ✅ جرّب كل الأسماء الشائعة
  const token =
    localStorage.getItem("access") ||
    localStorage.getItem("token") ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
