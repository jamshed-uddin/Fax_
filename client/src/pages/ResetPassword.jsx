import { useState } from "react";
import useTheme from "../hooks/useTheme";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Counter from "../components/Counter";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { dark } = useTheme();
  const navigate = useNavigate();
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
    } else if (newPassword.length < 6) {
      return setError("Minimum password length is 6.");
    } else if (
      newPassword === "123456" ||
      newPassword.toLocaleLowerCase() === "password"
    ) {
      return setError("Choose more secure password.");
    }

    setLoading(true);
    try {
      const result = await axios.put("/api/user/resetPassword", {
        resetToken,
        newPassword,
      });

      if (result.data.message === "Password reset success") {
        navigate("/signin");
      }
    } catch (error) {
      if (error.response.status === 401) {
        setError(error.response.data.message);
      }

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
      <div className="w-[85%] lg:w-2/5 mx-auto ">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Create a new password
        </h1>
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
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
          <div
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? (
              <EyeIcon className="w-5 h-5" />
            ) : (
              <EyeSlashIcon className="w-5 h-5" />
            )}
          </div>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            className={`input input-bordered focus:outline-0 focus:border-[1.3px] ${
              dark ? "focus:border-white" : "focus:border-black"
            }  input-md w-full`}
            value={confirmNewPassword}
            onChange={(e) => {
              setError("");
              setConfirmNewPassword(e.target.value);
            }}
          />
          <div
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? (
              <EyeIcon className="w-5 h-5" />
            ) : (
              <EyeSlashIcon className="w-5 h-5" />
            )}
          </div>
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
        <div className=" flex justify-end mt-1">
          <Counter minutes={1} />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
