import React, { useState } from "react";
import useAuthProvider from "../hooks/useAuthProvider";
import axios from "axios";

const Modal = ({
  modalFor,
  isModalOpen,
  setIsModalOpen,
  chatId,
  userId,
  userRefetch,
}) => {
  const { user } = useAuthProvider();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [loading, setLoading] = useState(false);

  const handleModalClose = () => {
    if (modalFor === "editProfile") {
      setName(user?.name);
      setBio(user?.bio || "");
    }
    setIsModalOpen((p) => !p);
  };

  const handleUserUpdate = async () => {
    if (!name || !bio) return;

    try {
      setLoading(true);
      const result = await axios.put("/api/user", { name, bio });
      setLoading(false);
      userRefetch();
      handleModalClose();
      console.log(result.data);
    } catch (error) {
      console.log(error?.response?.data);
      setLoading(false);
      console.log(error.message);
    }
  };

  return (
    <div
      className={`w-11/12 p-3 lg:w-2/5 mx-auto h-fit bg-white shadow-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-xl ${
        !isModalOpen && "hidden"
      } `}
    >
      {(modalFor === "deleteChat" || modalFor === "leaveGroup") && (
        <div className=" flex flex-col h-full space-y-12">
          <h1 className="flex-grow text-xl font-medium">
            {modalFor === "deleteChat"
              ? "Delete this conversation?"
              : "Leave this group?"}
          </h1>

          <div className="text-end space-x-2 ">
            {modalFor === "deleteChat" ? (
              <button className="btn btn-sm btn-error text-white">
                Delete
              </button>
            ) : (
              <button className="btn btn-sm btn-error text-white">Leave</button>
            )}
            <button onClick={handleModalClose} className="btn btn-sm ">
              Cancel
            </button>
          </div>
        </div>
      )}

      {modalFor === "editProfile" && (
        <div className=" flex flex-col h-full">
          <h1 className="flex-grow text-xl font-medium">Edit profile</h1>
          <div className="my-5 space-y-3">
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered focus:outline-0 input-sm w-full "
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Bio"
              className="input input-bordered focus:outline-0 input-sm w-full "
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="text-end space-x-2 ">
            <button onClick={handleModalClose} className="btn btn-sm ">
              Cancel
            </button>
            <button onClick={handleUserUpdate} className="btn btn-sm ">
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
