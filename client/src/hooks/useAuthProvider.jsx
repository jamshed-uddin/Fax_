import React, { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const useAuthProvider = () => {
  const authOptions = useContext(AuthContext);
  return authOptions;
};

export default useAuthProvider;
