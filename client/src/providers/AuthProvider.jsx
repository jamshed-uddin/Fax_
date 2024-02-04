import React, { createContext } from "react";

export const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
  const setCredentialsToLocal = (credentials) => {
    localStorage.setItem("userInfo", JSON.stringify(credentials));
  };

  const authOptions = {};

  return <AuthContext.Provider value={authOptions}></AuthContext.Provider>;
};

export default AuthProvider;
