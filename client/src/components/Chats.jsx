import React from "react";
import ChatCard from "./ChatCard";
import CardSkeleton from "./CardSkeleton";
import { Link } from "react-router-dom";

const Chats = ({ chats, chatsLoading }) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Chats</h1>
      <div className="space-y-2">
        {chatsLoading ? (
          <CardSkeleton />
        ) : (
          chats?.map((chat, index) => (
            <div key={index}>
              <Link to={`inbox/${index}`}>
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
