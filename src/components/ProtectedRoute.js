import { Navigate } from "react-router-dom";
import { getToken } from "../services/authService";

const ProtectedRoute = ({ children }) => {
  return getToken() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
