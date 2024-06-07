import React, { useState } from "react";
import {
  isOwnMessage,
  isUsersLastMessage,
  messageTime,
} from "../logics/messageLogics";
import useAuthProvider from "../hooks/useAuthProvider";
import { TrashIcon } from "@heroicons/react/24/outline";
import useTheme from "../hooks/useTheme";
import Modal from "./Modal";
import useOnlineStatus from "../hooks/useOnlineStatus";
import axios from "axios";
import useCloseMenu from "../hooks/useCloseMenu";
import useLongPress from "../hooks/useLongPress";

const SingleMessage = ({ message, index, msgArr, singleChat, setMessages }) => {
  const { user } = useAuthProvider();
  const { online } = useOnlineStatus();

  const dark = useTheme();
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [showMessageOptions, setShowMessageOptions] = useState(false);
  const { isMenuOpen: isModalOpen, setIsMenuOpen: setIsModalOpen } =
    useCloseMenu("message-modal");
  const { start, stop } = useLongPress(() => {}, 2000);

  // deleting message func and passed it as props to message delete modal
  const handleDeleteMessage = async (message, deleteFor) => {
    if (!online) return;
    setMessages((prev) =>
      prev.filter((singleMsg) => singleMsg._id !== message._id)
    );

    try {
      await axios.put(`/api/message/deleteMessage/${message._id}`, {
        deleteFor,
      });
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <>
      <div id="message-modal">
        <Modal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          modalFor={"deleteMessage"}
          message={message}
          func={handleDeleteMessage}
        />
      </div>
      {/* user avatar */}
      {!isOwnMessage(message?.sender, user?._id) && (
        <div className=" h-9 w-9 rounded-full overflow-hidden  ">
          {isUsersLastMessage(msgArr, index, message) && (
            <img
              className="w-full h-full object-cover rounded-full"
              src={
                message?.sender?.photoURL ||
                "https://i.ibb.co/Twp960D/default-profile-400x400.png"
              }
              alt={`Chat participent's profile picture`}
            />
          )}
        </div>
      )}
      {/* message text */}
      <div
        onMouseEnter={() => setHoveredMessageId(message._id)}
        onMouseLeave={() => setHoveredMessageId(null)}
        className=" ml-2 max-w-[80%] "
      >
        {!isOwnMessage(message?.sender, user?._id) &&
          isUsersLastMessage(msgArr, index, message, "first") &&
          singleChat?.isGroupChat && (
            <div className="text-xs ml-1">{message?.sender?.name}</div>
          )}

        {/* message and message option flexed */}
        <div className="flex items-center gap-1">
          {/* message */}
          <div
            className={`  w-full  text-sm md:text-base shadow-md px-3 py-[0.35rem]  rounded-lg flex items-end ${
              dark ? "bg-slate-800" : "bg-slate-200"
            } ${
              message?.type === "event"
                ? "bg-transparent shadow-none items-center "
                : ""
            }`}
          >
            <div className="flex-grow">
              {message?.type === "event" && message?.sender?.name}{" "}
              {message?.content}
            </div>
            <div className="shrink-0 text-end  text-[0.60rem] ml-2 -mb-2 -mr-1 ">
              {messageTime(message?.createdAt)}
            </div>
          </div>
          {/* message options */}
          <div
            className={`${
              isOwnMessage(message?.sender, user?._id)
                ? "order-first"
                : "order-last"
            }`}
          >
            <div
              onClick={() => {
                setIsModalOpen(true);
              }}
              className={`cursor-pointer transition-opacity duration-300 ${
                hoveredMessageId === message._id ? "opacity-100" : "opacity-0"
              }`}
            >
              <TrashIcon className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleMessage;
