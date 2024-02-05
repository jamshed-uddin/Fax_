import React from "react";
import useAuthProvider from "../hooks/useAuthProvider";
import SideChats from "../components/SideChats";
import { Outlet } from "react-router-dom";

const ChatPage = () => {
  const { user } = useAuthProvider();
  console.log(user);

  return (
    <div className="my-container h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] mt-1">
      <div className="flex h-full ">
        <div className="lg:w-[30%]  overflow-y-auto">
          <div className="h-min">
            <SideChats />
          </div>
        </div>
        <div className="border-2 border-red-500 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
