import React from "react";
import { Link } from "react-router-dom";

const ChatCard = ({ chat, clickFunc }) => {
  return (
    <div
      onClick={clickFunc}
      className="h-14 w-full rounded-lg  flex items-center gap-2"
    >
      {/* image */}
      <div className="h-12 w-12 rounded-full bg-slate-200"></div>
      {/* other info */}
      <div>
        <h1 className="text-lg font-medium leading-4">Chat name</h1>
        <h2>Last message</h2>
      </div>
    </div>
  );
};

export default ChatCard;
