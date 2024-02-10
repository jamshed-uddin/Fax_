import io from "socket.io-client";
import { createContext, useEffect, useState } from "react";
import useAuthProvider from "../hooks/useAuthProvider";
import axios from "axios";

export const ChatsContext = createContext({});

const ChatsProvider = ({ children }) => {
  const { user } = useAuthProvider();

  const [isSideChatOpen, setIsSideChatOpen] = useState(true);

  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [typingStatus, setTypingStatus] = useState({});
  const [readBy, setReadBy] = useState([]);

  useEffect(() => {
    if (!user) return;

    const newSocket = io("ws://localhost:2000");

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    socket?.emit("userSetup", user);
    socket?.on("activeUsers", (data) => {
      setActiveUsers(data);
      console.log(data);
    });
  }, [socket, user]);

  useEffect(() => {
    socket?.on("typing", (data) => {
      console.log(data);
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

  const lastSeen = (currentTime, previousTime) => {
    const msDifference = currentTime - previousTime;

    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;

    //difference in time unit
    const minutes = Math.floor(msDifference / minute);
    const hours = Math.floor(msDifference / hour);
    const days = Math.floor(msDifference / day);
    const weeks = Math.floor(msDifference / week);
    const months = Math.floor(msDifference / month);

    // showing to time
    if (months > 0) {
      return (
        previousTime.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }) +
        " " +
        previousTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    } else if (weeks > 0) {
      return weeks === 1 ? "1 Week ago" : `${weeks} weeks ago`;
    } else if (days > 0) {
      return days === 1 ? "1 day ago" : `${days} days ago`;
    } else if (hours > 0) {
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    } else if (minutes > 0) {
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    } else {
      return "Just now";
    }
  };

  const chatInfo = {
    isSideChatOpen,
    setIsSideChatOpen,
    socket,
    activeUsers,
    isUserActive,
    typingStatus,
    lastSeen,
  };
  return (
    <ChatsContext.Provider value={chatInfo}>{children}</ChatsContext.Provider>
  );
};

export default ChatsProvider;
