import React from "react";
import useAuthProvider from "../hooks/useAuthProvider";

const ChatPage = () => {
  const { user } = useAuthProvider();
  console.log(user);

  return <div>ChatPage</div>;
};

export default ChatPage;
