import React, { useContext } from "react";
import { ChatsContext } from "../providers/ChatsProvider";

const useChatProvider = () => {
  const chatStates = useContext(ChatsContext);
  return chatStates;
};

export default useChatProvider;
