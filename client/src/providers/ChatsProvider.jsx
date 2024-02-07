import React, { createContext, useState } from "react";

export const ChatsContext = createContext({});

const ChatsProvider = ({ children }) => {
  const [isSideChatOpen, setIsSideChatOpen] = useState(true);

  const chatInfo = { isSideChatOpen, setIsSideChatOpen, greet: "hello" };

  return (
    <ChatsContext.Provider value={chatInfo}>{children}</ChatsContext.Provider>
  );
};

export default ChatsProvider;
