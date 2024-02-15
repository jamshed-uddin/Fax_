import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuthProvider from "../hooks/useAuthProvider";

export const SocketContext = createContext(null);
const SocketProvider = ({ children }) => {
  const { user } = useAuthProvider();

  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [typingStatus, setTypingStatus] = useState({});
  const [latestMessage, setLatestMessage] = useState({});
  const [sendMessage, setSendMessage] = useState();

  useEffect(() => {
    if (!user) return;

    const newSocket = io("ws://localhost:2000", {
      query: { userId: user?._id },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // active users
  useEffect(() => {
    socket?.on("activeUsers", (data) => {
      setActiveUsers(data);
    });
  }, [socket, user]);

  // typing indicator
  useEffect(() => {
    socket?.on("typing", (data) => {
      setTypingStatus(data);
    });
  }, [socket]);

  // update lastMessage readBy

  const isUserActive = (user, chatUsers) => {
    const otherUser = chatUsers?.find((u) => u._id !== user?._id);

    const activeUser = activeUsers.find(
      (user) => user.userId === otherUser?._id
    );

    return !!activeUser;
  };

  const value = {
    socket,
    activeUsers,
    typingStatus,
    latestMessage,
    setLatestMessage,
    isUserActive,
  };

  return (
    <SocketContext.Provider value={value}> {children}</SocketContext.Provider>
  );
};

export default SocketProvider;
