// components/ProtectedRoute.jsx
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return admin ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
