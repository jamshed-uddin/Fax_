import io from "socket.io-client";
import React, { createContext, useEffect, useState } from "react";
import useAuthProvider from "../hooks/useAuthProvider";

export const ChatsContext = createContext({});

const ChatsProvider = ({ children }) => {
  const { user } = useAuthProvider();
  console.log(user);
  const [isSideChatOpen, setIsSideChatOpen] = useState(true);

  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [typingStatus, setTypingStatus] = useState({});

  useEffect(() => {
    if (!user) return;

    const newSocket = io("ws://localhost:2000");
    newSocket.emit("userSetup", user);
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [user]);

  useEffect(() => {
    socket?.on("activeUsers", (data) => {
      setActiveUsers(data);
      console.log(data);
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("typing", (data) => {
      console.log(data);
      setTypingStatus(data);
    });
  }, [socket]);

  const isUserActive = (user, chatUsers) => {
    const otherUser = chatUsers?.find((u) => u._id !== user?._id);

    const activeUser = activeUsers.find(
      (user) => user.userId === otherUser?._id
    );

    return !!activeUser;
  };
  console.log(typingStatus);

  const chatInfo = {
    isSideChatOpen,
    setIsSideChatOpen,
    socket,
    activeUsers,
    isUserActive,
    typingStatus,
  };
  return (
    <ChatsContext.Provider value={chatInfo}>{children}</ChatsContext.Provider>
  );
};

export default ChatsProvider;
