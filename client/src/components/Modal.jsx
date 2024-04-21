import { useCallback, useEffect, useState } from "react";
import useAuthProvider from "../hooks/useAuthProvider";
import axios from "axios";
import useTheme from "../hooks/useTheme";
import { useNavigate } from "react-router-dom";
import EditUserProfile from "./EditUserProfile";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";

const Modal = ({
  modalFor,
  isModalOpen,
  setIsModalOpen,
  chat,
  message,
  userRefetch,
  func,
}) => {
  const { dark } = useTheme();
  const { user } = useAuthProvider();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const btnStyle = `btn btn-neutral btn-sm px-8 ${
    dark
      ? "bg-white text-gray-800 hover:bg-white hover:text-gray-800"
      : "text-white "
  }`;
  const toastStyle = {
    style: dark
      ? {
          background: "rgb(15 23 42)",
          color: "white",
          borderRadius: "20px",
          padding: "5px 10px",
        }
      : { borderRadius: "20px", padding: "5px 10px" },
  };

  const toastNotify = () => {
    toast("Something went wrong!", toastStyle);
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
      toastNotify();
    }
  };

  const deleteMessageHandler = async (deleteFor) => {
    func(message, deleteFor, toastNotify);
  };

  const deleteChatHandler = async () => {
    try {
      setLoading(true);
      const result = await axios.put(`/api/chat/deleteChat/${chat._id}`);
      if (result.data.message === "Chat deleted succesfully") {
        navigate("/");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toastNotify();
    }
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <div
        className={`w-11/12 p-3 lg:w-2/5 mx-auto h-fit max-h-[90vh] overflow-y-auto   absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-xl ${
          !isModalOpen && "hidden"
        }  ${
          dark
            ? "bg-slate-800 shadow-lg shadow-slate-700"
            : "bg-white shadow-2xl"
        }`}
      >
        {(modalFor === "deleteChat" || modalFor === "leaveGroup") && (
          <div className=" flex flex-col h-full space-y-12">
            <h1 className="flex-grow text-xl font-medium">
              {modalFor === "deleteChat"
                ? `Delete this conversation?`
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
                    onClick={deleteChatHandler}
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
          <EditUserProfile
            handleModalClose={handleModalClose}
            userRefetch={userRefetch}
          />
        )}

        {modalFor === "emailLinkSendModal" && (
          <div>
            <div className=" text-lg my-3">
              An email sent to you with the sign in link.Follow the instruction
              to sign in.
            </div>
            <div className="flex justify-end">
              <button onClick={handleModalClose} className={btnStyle}>
                Ok
              </button>
            </div>
          </div>
        )}

        {modalFor === "deleteMessage" && (
          <div className="my-5 ">
            <div>
              <h2 className="text-xl font-medium">Delete this message!</h2>
              <div className="mt-3 space-y-1">
                <h3
                  onClick={() => {
                    deleteMessageHandler("own");
                  }}
                  className=" font-medium cursor-pointer w-fit"
                >
                  Delete for me <TrashIcon className="w-5 h-5 inline" />
                </h3>
                {message?.sender?._id === user?._id && (
                  <h3
                    onClick={() => {
                      deleteMessageHandler("everyone");
                    }}
                    className=" font-medium cursor-pointer w-fit"
                  >
                    Delete for everyone <TrashIcon className="w-5 h-5 inline" />
                  </h3>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Modal;
