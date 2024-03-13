import { useState } from "react";
import useTheme from "../hooks/useTheme";
import axios from "axios";
import Modal from "../components/Modal";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { dark } = useTheme();

  const btnStyle = `btn btn-neutral btn-sm px-8 ${
    dark
      ? "bg-white text-gray-800 hover:bg-white hover:text-gray-800"
      : "text-white "
  }`;

  const handleResetPassRequest = async () => {
    if (!newPassword) {
      return setError("New password required");
    } else if (newPassword !== confirmNewPassword) {
      return setError("Passwords do not match");
    }
    setLoading(true);
    try {
      const result = await axios.post("/api/user/resetPassword", {
        resetToken,
        newPassword,
      });
      console.log(result.data);
    } catch (error) {
      if (error.response.status === 401) {
        setError(error.response.data.message);
      }
      console.log(error);
      setLoading(false);
    }
    setLoading(false);
  };
  return (
    <div
      className={`my-container flex justify-center items-center  h-screen  ${
        dark ? "bg-slate-900 text-white" : "bg-white text-gray-800 "
      } `}
    >
      <div className="w-[85%] lg:w-2/5a mx-auto ">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Create a new password
        </h1>
        <div className="form-control">
          <label className="label">
            <span className=" text-lg font-semibold">New password</span>
          </label>
          <input
            type="text"
            placeholder="New password"
            className={`input input-bordered focus:outline-0 focus:border-[1.3px] ${
              dark ? "focus:border-white" : "focus:border-black"
            }  input-md w-full`}
            value={newPassword}
            onChange={(e) => {
              setError("");
              setNewPassword(e.target.value);
            }}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className=" text-lg font-semibold">Confirm password</span>
          </label>
          <input
            type="email"
            placeholder="email"
            className={`input input-bordered focus:outline-0 focus:border-[1.3px] ${
              dark ? "focus:border-white" : "focus:border-black"
            }  input-md w-full`}
            value={confirmNewPassword}
            onChange={(e) => {
              setError("");
              setConfirmNewPassword(e.target.value);
            }}
          />
        </div>
        {error && <span className="text-red-500 text-sm ml-1">{error}</span>}
        <div className="form-control mt-3">
          <button
            disabled={loading}
            type="submit"
            className={btnStyle}
            onClick={handleResetPassRequest}
          >
            {loading ? "Reseting..." : "Reset"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
