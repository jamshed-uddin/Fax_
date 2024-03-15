import React, { useState } from "react";
import useAuthProvider from "../hooks/useAuthProvider";
import axios from "axios";
import useTheme from "../hooks/useTheme";
import { useNavigate } from "react-router-dom";

const Modal = ({
  modalFor,
  isModalOpen,
  setIsModalOpen,
  chat,
  userId,
  userRefetch,
}) => {
  const { dark } = useTheme();
  const { user } = useAuthProvider();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const btnStyle = `btn btn-neutral btn-sm px-8 ${
    dark
      ? "bg-white text-gray-800 hover:bg-white hover:text-gray-800"
      : "text-white "
  }`;

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

  const leaveGroupHandler = async () => {
    const userLeft = chat?.users.filter((member) => member._id !== user._id);
    setLoading(true);
    try {
      await axios
        .put(`/api/chat/group/${chat?._id}`, {
          ...{ users: userLeft },
          groupAdmin: chat?.groupAdmin,
        })
        .then(async (res) => {
          console.log(res);
          setLoading(false);
          navigate("/");
          const newEventMessage = {
            content: "left the group",
            type: "event",
            chatId: chat._id,
          };
          await axios.post("/api/message/newMessage", newEventMessage);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div
      className={`w-11/12 p-3 lg:w-2/5 mx-auto h-fit   absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-xl ${
        !isModalOpen && "hidden"
      }  ${
        dark ? "bg-slate-800 shadow-lg shadow-slate-700" : "bg-white shadow-2xl"
      }`}
    >
      {(modalFor === "deleteChat" || modalFor === "leaveGroup") && (
        <div className=" flex flex-col h-full space-y-12">
          <h1 className="flex-grow text-xl font-medium">
            {modalFor === "deleteChat"
              ? `Delete this ${chat?.isGroupChat ? "group" : "conversation"}?`
              : "Leave this group?"}
          </h1>

          <div className="gap-2 flex justify-end items-center">
            <div className="">
              {loading && (
                <span
                  className={`loading loading-spinner  w-6 ${
                    dark ? "text-white" : "text-black"
                  }`}
                ></span>
              )}
            </div>
            <div>
              {modalFor === "deleteChat" ? (
                <button
                  disabled={loading}
                  className="btn btn-sm btn-error text-white"
                >
                  Delete
                </button>
              ) : (
                <button
                  disabled={loading}
                  onClick={leaveGroupHandler}
                  className="btn btn-sm btn-error text-white"
                >
                  Leave
                </button>
              )}
            </div>
            <div>
              <button onClick={handleModalClose} className="btn btn-sm ">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {modalFor === "editProfile" && (
        <div className=" flex flex-col ">
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
            <button onClick={handleUserUpdate} className={btnStyle}>
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      )}

      {modalFor === "emailLinkSendModal" && (
        <div>
          <div className=" text-lg my-3">
            An email sent to you with the sign in link.Follow the instruction to
            sign in.
          </div>
          <div className="flex justify-end">
            <button onClick={handleModalClose} className={btnStyle}>
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
