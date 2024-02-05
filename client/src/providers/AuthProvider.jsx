/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  //   get userInfo from local
  //   useEffect(() => {
  //     setUser(JSON.parse(localStorage.getItem("userInfo")));
  //   }, [user]);
  useEffect(() => {
    const userFromLocal = JSON.parse(localStorage.getItem("userInfo"));
    if (user === null) {
      setUser(userFromLocal || null);
    }
  }, [user]);

  useEffect(() => {
    if (user !== null) {
      localStorage.setItem("userInfo", JSON.stringify(user));
    }
  }, [user]);

  const registerUser = async (userInfo) => {
    try {
      const result = await axios.post("/api/user", userInfo);
      setUser(result.data);
      return result.data;
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 401)
      ) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Something went wrong");
      }
    }
  };

  const userSignIn = async (userInfo) => {
    try {
      const result = await axios.post("/api/user/auth", userInfo);
      setUser(result.data);
      return result.data;
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 401)
      ) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Something went wrong");
      }
    }
  };

  const userLogout = async () => {
    try {
      const result = await axios.post("api/user/logout");
      setUser(null);
      localStorage.removeItem("userInfo");
      return result.data;
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 401)
      ) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Something went wrong");
      }
    }
  };

  const authOptions = { user, registerUser, userSignIn, userLogout };

  return (
    <AuthContext.Provider value={authOptions}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
