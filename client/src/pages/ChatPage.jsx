import React, { useState } from "react";
import useAuthProvider from "../hooks/useAuthProvider";
import SideChats from "../components/SideChats";
import { Outlet } from "react-router-dom";
import "./chatPage.css";
import ChatsProvider from "../providers/ChatsProvider";

const ChatPage = () => {
  const { user } = useAuthProvider();
  const [hideSideChat, setHideSideChat] = useState(false);

  return (
    <div className="my-container h-screen  py-4">
      <div className="lg:flex h-full gap-2 ">
        <div className="lg:w-[40%] lg:shadow-md  lg:rounded-md pt-2 pl-2  ">
          <SideChats setHideSideChat={setHideSideChat} />
        </div>

        <div className="h-full flex-grow lg:shadow-md lg:rounded-md pt-2 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
