import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }: any) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/auth" />;
  }

  return children;
};

export default ProtectedRoute;
