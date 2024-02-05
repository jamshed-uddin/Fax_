import useAuthProvider from "../hooks/useAuthProvider";
import { Navigate, useLocation } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const { user } = useAuthProvider();
  const location = useLocation();
  if (user) {
    return children;
  }

  return <Navigate to={"/signin"} state={{ from: location }} replace />;
};

export default PrivateRoute;
