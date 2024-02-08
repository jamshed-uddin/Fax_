import React from "react";
import { Link } from "react-router-dom";

const ChatCard = ({ chat, clickFunc }) => {
  return (
    <div
      onClick={clickFunc}
      className="h-14 w-full rounded-lg  flex items-center gap-2"
    >
      {/* image */}
      <div className="h-11 w-11 rounded-full  overflow-hidden">
        <img
          className="w-full h-full object-cover rounded-full"
          src={chat?.chatPhotoURL}
          alt=""
        />
      </div>
      {/* other info */}
      <div>
        <h1 className="text-lg font-medium leading-4">{chat?.chatName}</h1>
        <h2>{chat?.lastMessage}</h2>
      </div>
    </div>
  );
};

export default ChatCard;
