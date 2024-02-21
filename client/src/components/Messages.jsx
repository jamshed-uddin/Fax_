import { useEffect, useState } from "react";
import {
  chatDate,
  isOwnMessage,
  isUsersLastMessage,
  messageDate,
  messageTime,
} from "../logics/messageLogics";
import useAuthProvider from "../hooks/useAuthProvider";
import useTheme from "../hooks/useTheme";

const Messages = ({ messages, singleChat }) => {
  const { user } = useAuthProvider();
  const { dark } = useTheme();
  const [messageGroup, setMessageGroup] = useState([]);

  useEffect(() => {
    const messageDate = (messageDate) =>
      new Date(messageDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

    const group = messages?.reduce((acc, message) => {
      if (acc[messageDate(message.updatedAt)]) {
        acc[messageDate(message.updatedAt)]?.push(message);
      } else {
        acc[messageDate(message.updatedAt)] = [message];
      }

      return acc;
    }, {});

    setMessageGroup(group);
  }, [messages]);

  console.log(messageGroup);

  return (
    <div className="h-max  my-2  w-full ">
      {Object.keys(messageGroup)?.map((date) => (
        <div key={date} className="relative">
          <div className="flex justify-center sticky top-1 left-0 right-0">
            <h3
              className={`w-fit  rounded-xl px-3 py-[0.20rem] text-sm mb-1 ${
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
                  message?.sender._id === user?._id
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
                          src={message?.sender?.photoURL}
                          alt={`Profile photo of `}
                        />
                      )}
                    </div>
                  )}
                  {/* message text */}
                  <div className=" ml-2 max-w-[75%] ">
                    {!isOwnMessage(message?.sender, user?._id) &&
                      isUsersLastMessage(msgArr, index, message, "first") &&
                      singleChat?.isGroupChat && (
                        <div className="text-xs ml-1">
                          {message?.sender?.name}
                        </div>
                      )}
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
                        {messageTime(message?.updatedAt)}
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
