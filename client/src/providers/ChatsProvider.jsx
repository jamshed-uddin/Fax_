import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { createContext, useState } from "react";

export const ChatsContext = createContext({});

const ChatsProvider = ({ children }) => {
  const [isSideChatOpen, setIsSideChatOpen] = useState(true);

  const {
    data: myChats,
    isLoading: myChatsLoading,
    error: myChatsError,
  } = useQuery({
    queryKey: ["myChats"],
    queryFn: async () => {
      try {
        const result = await axios.get("/api/chat");
        return result.data;
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 400 || error.response.status === 401)
        ) {
          throw new Error(error.response.data.message);
        } else {
          throw new Error("Something went wrong");
        }
      }
    },
  });

  const chatInfo = {
    isSideChatOpen,
    setIsSideChatOpen,
    myChats,
    myChatsLoading,
  };
  return (
    <ChatsContext.Provider value={chatInfo}>{children}</ChatsContext.Provider>
  );
};

export default ChatsProvider;
