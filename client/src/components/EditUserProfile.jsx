import { useState } from "react";
import useTheme from "../hooks/useTheme";
import useAuthProvider from "../hooks/useAuthProvider";
import axios from "axios";
import { EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/outline";

const EditUserProfile = ({ userRefetch, handleModalClose }) => {
  const { dark } = useTheme();
  const { user } = useAuthProvider();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [loading, setLoading] = useState(false);
  const [passChanging, setPassChanging] = useState(false);
  const [profileUpdating, setProifleUpdating] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passForDeleting, setPassForDeleting] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    retype: false,
    delete: false,
  });
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [error, setError] = useState("");
  const [deleteAccError, setDeleteAccError] = useState("");

  const btnStyle = `btn btn-neutral btn-sm px-8 ${
    dark
      ? "bg-white text-gray-800 hover:bg-white hover:text-gray-800"
      : "text-white "
  }`;

  const inputStyle = `input input-bordered focus:outline-0 focus:border-[1.3px] ${
    dark ? "focus:border-white" : "focus:border-black"
  }  input-sm w-full`;

  const handleClose = () => {
    handleModalClose();
    setCurrentPassword("");
    setConfirmNewPassword("");
    setNewPassword("");
    setShowPassword({
      current: false,
      new: false,
      retype: false,
      delete: false,
    });
    setShowDeleteOptions(false);
    setBio(user?.bio || "");
  };

  const handleNameBioUpdate = async () => {
    if (!name || !bio) return;

    try {
      setProifleUpdating(true);
      await axios.put("/api/user", { name, bio });
      setProifleUpdating(false);
      userRefetch();
    } catch (error) {
      setProifleUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (
      newPassword === "123456" ||
      newPassword.toLocaleLowerCase() === "password"
    ) {
      return setError("Choose more secure password");
    } else if (!currentPassword) {
      return setError("Current password is required");
    } else if (!newPassword) {
      return setError("Create a new password");
    } else if (!confirmNewPassword) {
      return setError("Re-type new passowrd");
    } else if (newPassword !== confirmNewPassword) {
      return setError("Passwords do not match");
    }

    const body = { currentPassword, newPassword };

    setPassChanging(true);
    try {
      await axios.put("/api/user/changePassword", body);

      setPassChanging(false);
    } catch (error) {
      setError(error?.response?.data?.message);
      setPassChanging(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!passForDeleting) {
      return setDeleteAccError("Password is required");
    }
    try {
      setLoading(true);
      await axios.delete("/api/user/deleteUser", {
        data: { password: passForDeleting },
      });

      setLoading(false);
    } catch (error) {
      setDeleteAccError(error?.response?.data?.message);
      setLoading(false);
    }
  };
  return (
    <div>
      <div className=" flex flex-col ">
        <div className="flex justify-between items-center">
          <h1 className="flex-grow text-2xl font-medium">Edit profile</h1>
          <button onClick={handleClose} className="btn btn-sm ">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* name bio */}
        <div className="mt-3">
          <div>
            <h3 className="text-lg font-semibold">Personal detail</h3>
          </div>
          <div className="my-2 space-y-3">
            <input
              type="text"
              placeholder="Name"
              className={inputStyle}
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="new-password"
            />
            <input
              type="text"
              placeholder="Bio"
              className={inputStyle}
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="text-end space-x-2 ">
            <button
              disabled={profileUpdating}
              onClick={handleNameBioUpdate}
              className={btnStyle}
            >
              {profileUpdating ? "Updating..." : "Update"}
            </button>
          </div>
        </div>

        {/* password change */}
        <div className="mt-6">
          <div>
            <h3 className="text-lg font-semibold">Change password</h3>
            <div className="my-2">
              <div className="relative mb-3">
                <input
                  type={showPassword.current ? "text" : "password"}
                  placeholder="Current password"
                  className={inputStyle}
                  value={currentPassword}
                  onChange={(e) => {
                    setError("");
                    setCurrentPassword(e.target.value);
                  }}
                  autoComplete="new-password"
                />
                <div
                  onClick={() =>
                    setShowPassword((p) => ({ ...p, current: !p.current }))
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword.current ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5" />
                  )}
                </div>
              </div>
              <div className="relative mb-3">
                <input
                  type={showPassword.new ? "text" : "password"}
                  placeholder="New password"
                  className={inputStyle}
                  value={newPassword}
                  onChange={(e) => {
                    setError("");
                    setNewPassword(e.target.value);
                  }}
                  autoComplete="new-password"
                />
                <div
                  onClick={() =>
                    setShowPassword((p) => ({ ...p, new: !p.new }))
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword.new ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5" />
                  )}
                </div>
              </div>
              <div className="relative">
                <input
                  type={showPassword.retype ? "text" : "password"}
                  placeholder="Re-type new password"
                  className={inputStyle}
                  value={confirmNewPassword}
                  onChange={(e) => {
                    setError("");
                    setConfirmNewPassword(e.target.value);
                  }}
                  autoComplete="new-password"
                />
                <div
                  onClick={() =>
                    setShowPassword((p) => ({ ...p, retype: !p.retype }))
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword.retype ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5" />
                  )}
                </div>
              </div>
              {error && (
                <span className="text-red-500 text-sm ml-1">{error}</span>
              )}
            </div>
            <div className="flex justify-end mt-2">
              <button
                disabled={passChanging}
                type="submit"
                className={btnStyle}
                onClick={handleChangePassword}
              >
                {passChanging ? "Changing..." : "Change"}
              </button>
            </div>
          </div>
        </div>

        {/* delete account */}
        <div className="mt-6 ">
          <h3
            onClick={() => setShowDeleteOptions(true)}
            className="text-red-500 font-semibold cursor-pointer text-lg"
          >
            Delete account
          </h3>

          {showDeleteOptions && (
            <div className="mt-1 mb-4">
              <p>
                This will also delete all you contact and you will not be able
                to retrive the data you added.
              </p>

              <div className="relative mb-2 mt-2">
                <input
                  type={showPassword.delete ? "text" : "password"}
                  placeholder="Enter password"
                  className={inputStyle}
                  value={passForDeleting}
                  onChange={(e) => {
                    setDeleteAccError("");
                    setPassForDeleting(e.target.value);
                  }}
                  autoComplete="new-password"
                />
                <div
                  onClick={() =>
                    setShowPassword((p) => ({ ...p, delete: !p.delete }))
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword.delete ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5" />
                  )}
                </div>
              </div>
              {deleteAccError && (
                <span className="text-red-500 text-sm ml-1">
                  {deleteAccError}
                </span>
              )}
              <div className="flex justify-end">
                <button
                  disabled={loading}
                  type="submit"
                  className={btnStyle}
                  onClick={handleDeleteAccount}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditUserProfile;
