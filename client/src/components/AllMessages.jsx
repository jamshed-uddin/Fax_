import { useEffect, useState } from "react";
import useAuthProvider from "../hooks/useAuthProvider";
import {
  isOwnMessage,
  isUsersLastMessage,
  messageDate,
  messageTime,
} from "../logics/messageLogics";
const AllMessages = ({ allMessages = [], isGroupChat }) => {
  const { user } = useAuthProvider();
  const [messageGroup, setMessageGroup] = useState({});

  useEffect(() => {
    const group = {};

    allMessages.forEach((message) => {
      const messageDate = new Date(message.updatedAt).toLocaleDateString(
        "en-In",
        { day: "numeric", month: "short", year: "numeric" }
      );

      if (group[messageDate]) {
        group[messageDate].push(message);
      } else {
        group[messageDate] = [];
      }
    });

    setMessageGroup(group);
  }, [allMessages]);

  return (
    <div className="h-max  py-2  w-full ">
      {Object.keys(messageGroup).map((date) => (
        <div key={date}>
          <div className="text-center text-green-600">
            {messageDate(messageGroup[date][0].updatedAt)}
          </div>
          {messageGroup[date]?.map((message, index, msgArr) => (
            <div
              key={message._id}
              className={`flex items-center mb-2 ${
                isOwnMessage(message?.sender, user?._id)
                  ? "justify-end "
                  : "justify-start "
              }`}
            >
              {/* user avatar */}
              {!isOwnMessage(message?.sender, user?._id) && (
                <div className=" h-9 w-9 rounded-full overflow-hidden  ">
                  {isUsersLastMessage(msgArr, index, message) &&
                    !isOwnMessage(message?.sender, user?._id) && (
                      <img
                        className="w-full h-full object-cover rounded-full"
                        src={message?.sender.photoURL}
                        alt={`Profile photo of `}
                      />
                    )}
                </div>
              )}
              {/* message text */}
              <div className=" ml-2 max-w-[75%]">
                {!isGroupChat &&
                  isUsersLastMessage(msgArr, index, message, "first") &&
                  !isOwnMessage(message?.sender, user?._id) && (
                    <div className="text-xs ml-1">{message?.sender?.name}</div>
                  )}
                <div
                  className={` bg-slate-200 w-full text-black text-sm md:text-base shadow-md px-3 py-2  rounded-lg flex items-end `}
                >
                  <div className="flex-grow">{message?.content}</div>
                  <div className="shrink-0 text-end  text-[0.60rem] ml-2 -mb-2 -mr-1 ">
                    {messageTime(message?.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AllMessages;
