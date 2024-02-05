import React from "react";
import { useParams } from "react-router-dom";

const ChatInbox = () => {
  const { chatId } = useParams();
  return <div>inbox of chat {chatId}</div>;
};

export default ChatInbox;
