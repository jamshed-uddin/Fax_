import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuthProvider from "../hooks/useAuthProvider";
import useChatProvider from "../hooks/useChatProvider";

export const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const { user } = useAuthProvider();
  const { myChats } = useChatProvider();
  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [typingStatus, setTypingStatus] = useState({});
  const [latestMessage, setLatestMessage] = useState({});
  // const [sendMessage, setSendMessage] = useState(null);

  useEffect(() => {
    if (!user && !myChats) {
      return;
    }

    const newSocket = io("https://fax-pbi7.onrender.com", {
      query: { userId: user?._id },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, myChats]);

  // send message to socket
  // useEffect(() => {
  //   if (!user || sendMessage === null) return;
  //   console.log(sendMessage);
  //   console.log("send message running");

  //   socket?.emit("sendMessage", sendMessage);
  //   console.log("message emited");
  //   setSendMessage(null);
  //   console.log(sendMessage);
  // }, [sendMessage, socket, user]);

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

    const userOnline = Object.keys(activeUsers).find(
      (userId) => userId === otherUser?._id
    );

    return !!userOnline;
  };

  const value = {
    socket,
    activeUsers,
    typingStatus,
    latestMessage,
    setLatestMessage,
    isUserActive,
    // setSendMessage,
  };

  return (
    <SocketContext.Provider value={value}> {children}</SocketContext.Provider>
  );
};

export default SocketProvider;
