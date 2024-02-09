import React from "react";
import { Link } from "react-router-dom";
import useAuthProvider from "../hooks/useAuthProvider";

const ChatCard = ({ chat, clickFunc }) => {
  const { user } = useAuthProvider();

  return (
    <div
      onClick={clickFunc}
      className="h-14 w-full rounded-lg  flex items-center gap-2"
    >
      {/* image */}
      <div className="h-11 w-11 rounded-full  overflow-hidden">
        <img
          className="w-full h-full object-cover rounded-full"
          src={
            chat?.users[0]._id === user?._id
              ? chat?.users[1].photoURL
              : chat?.users[0].photoURL
          }
          alt=""
        />
      </div>
      {/* other info */}
      <div>
        <h1 className="text-lg font-medium leading-4">
          {chat?.users[0]._id === user?._id
            ? chat?.users[1].name
            : chat?.users[0].name}
        </h1>
        <h2>
          {chat?.latestMessage?.sender._id === user?._id
            ? `You: ${chat?.latestMessage?.content}`
            : chat?.latestMessage?.content}
        </h2>
      </div>
    </div>
  );
};

export default ChatCard;
