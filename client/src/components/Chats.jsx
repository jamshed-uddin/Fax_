import React from "react";
import ChatCard from "./ChatCard";
import CardSkeleton from "./CardSkeleton";
import { Link } from "react-router-dom";

const Chats = ({ chats, chatsLoading }) => {
  return (
    <div className="mb-3">
      <h1 className="text-2xl font-semibold mb-2">Chats</h1>
      <div className="space-y-2">
        {chatsLoading ? (
          <CardSkeleton />
        ) : (
          chats?.map((chat, index) => (
            <div key={index}>
              <Link to={`inbox/${index}`} replace={true}>
                <ChatCard key={chat._id} chat={chat} />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Chats;