import React from "react";
import useAuthProvider from "../hooks/useAuthProvider";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { userLogout } = useAuthProvider();
  const navigate = useNavigate();
  const userLogoutHandler = () => {
    userLogout();
    navigate("/");
  };
  return (
    <div className="my-container">
      <button onClick={userLogoutHandler} className="btn btn-primary">
        Logout
      </button>
    </div>
  );
};

export default Profile;
