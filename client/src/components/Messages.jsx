import { useEffect, useState } from "react";
import {
  isOwnMessage,
  isUsersLastMessage,
  messageDate,
  messageTime,
} from "../logics/messageLogics";
import useAuthProvider from "../hooks/useAuthProvider";
import useTheme from "../hooks/useTheme";
import { TrashIcon } from "@heroicons/react/24/outline";
import Modal from "./Modal";
import useCloseMenu from "../hooks/useCloseMenu";
import useOnlineStatus from "../hooks/useOnlineStatus";
import axios from "axios";
import useLongPress from "../hooks/useLongPress";

const Messages = ({ messages, setMessages, singleChat }) => {
  const { user } = useAuthProvider();
  const { dark } = useTheme();
  const { online } = useOnlineStatus();
  const [messageGroup, setMessageGroup] = useState([]);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [showMessageOptions, setShowMessageOptions] = useState(false);
  const [messageForDelete, setMessageForDelete] = useState(null);
  const { isMenuOpen: isModalOpen, setIsMenuOpen: setIsModalOpen } =
    useCloseMenu("message-modal");
  console.log(messages);
  useEffect(() => {
    const messageDate = (messageDate) =>
      new Date(messageDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

    const group = messages?.reduce((acc, message) => {
      if (acc[messageDate(message.createdAt)]) {
        acc[messageDate(message.createdAt)]?.push(message);
      } else {
        acc[messageDate(message.createdAt)] = [message];
      }

      return acc;
    }, {});

    setMessageGroup(group);
  }, [messages]);

  const { start, stop } = useLongPress(() => {
    console.log("longPressed");
    setShowMessageOptions(true);
  }, 800);

  // deleting message func and passed it as props to message delete modal
  const handleDeleteMessage = async (message, deleteFor) => {
    if (!online) return;
    setMessages((prev) =>
      prev.filter((singleMsg) => singleMsg._id !== message._id)
    );
    setIsModalOpen(false);

    try {
      const result = await axios.put(
        `/api/message/deleteMessage/${message._id}`,
        { deleteFor }
      );
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-max  my-2  w-full ">
      <div id="message-modal">
        <Modal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          modalFor={"deleteMessage"}
          message={messageForDelete}
          func={handleDeleteMessage}
        />
      </div>
      {Object.keys(messageGroup)?.map((date) => (
        <div key={date} className="relative">
          <div className="flex justify-center sticky top-1 left-0 right-0">
            <h3
              className={`w-fit  rounded-xl px-3 py-[0.20rem] text-xs lg:text-sm mb-1 ${
                dark ? "bg-slate-800" : "bg-slate-200"
              }`}
            >
              {messageDate(date)}
            </h3>
          </div>

          {messageGroup[date]?.map((message, index, msgArr) => (
            <div
              key={message._id}
              className={`flex items-end mb-2 ${
                isOwnMessage(message?.sender, user?._id)
                  ? "justify-end "
                  : "justify-start "
              } ${message?.type === "event" ? "justify-center" : ""} `}
            >
              {message.type === "event" ? (
                <h3 className="text-sm">{`${
                  message?.sender?._id === user?._id
                    ? "You"
                    : message?.sender?.name
                } ${message?.content}`}</h3>
              ) : (
                <>
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
                    onTouchStart={() => {
                      start();
                      setHoveredMessageId(message._id);
                    }}
                    onTouchEnd={() => {
                      stop();
                    }}
                    onTouchCancel={() => {
                      stop();
                    }}
                    onMouseOver={() => {
                      setHoveredMessageId(message._id);
                      setShowMessageOptions(true);
                    }}
                    onMouseLeave={() => {
                      setHoveredMessageId(null);
                      setShowMessageOptions(false);
                    }}
                    className=" ml-2 max-w-[80%] "
                  >
                    {!isOwnMessage(message?.sender, user?._id) &&
                      isUsersLastMessage(msgArr, index, message, "first") &&
                      singleChat?.isGroupChat && (
                        <div className="text-xs ml-1">
                          {message?.sender?.name}
                        </div>
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
                            setMessageForDelete(message);
                            setShowMessageOptions(false);
                          }}
                          className={`cursor-pointer transition-opacity duration-300 ${
                            showMessageOptions &&
                            hoveredMessageId === message._id
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Messages;
