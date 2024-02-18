import useAuthProvider from "../hooks/useAuthProvider";
import SideChats from "../components/SideChats";
import { Outlet, useLocation } from "react-router-dom";

import useChatProvider from "../hooks/useChatProvider";
import Hero from "../components/Hero";
import { useEffect, useState } from "react";
import useTheme from "../hooks/useTheme";
import OnlineStatus from "../components/OnlineStatus";
import useOnlineStatus from "../hooks/useOnlineStatus";

const ChatPage = () => {
  const { online } = useOnlineStatus();
  const { isSideChatOpen, setIsSideChatOpen } = useChatProvider();
  const { user, userLoading } = useAuthProvider();
  const { pathname } = useLocation();
  const { dark } = useTheme();
  const [latestMessage, setLatestMessage] = useState("hello world");
  console.log(online);
  useEffect(() => {
    if (pathname === "/") {
      setIsSideChatOpen(true);
    } else {
      setIsSideChatOpen(false);
    }
  }, [pathname, setIsSideChatOpen]);

  if (userLoading) {
    return <div className="h-screen bg-white"></div>;
  }

  if (!user) {
    return <Hero />;
  }

  return (
    <div className="my-container h-screen  lg:py-4 relative">
      <OnlineStatus />
      <div className="lg:flex h-full gap-2 ">
        <div
          className={`${
            dark ? "bg-slate-900 text-white" : "bg-white text-gray-800"
          } w-full h-full lg:w-[40%] lg:shadow-md  lg:rounded-md pt-2 px-2 absolute lg:static z-40  ${
            isSideChatOpen
              ? "top-0  left-0 "
              : "top-0 -left-[50rem] transition-all duration-500"
          }  `}
        >
          <SideChats />
        </div>

        <div
          className={`${
            dark ? "bg-slate-900 text-white" : "bg-white text-gray-800"
          } w-full lg:w-[60%]  h-full  lg:shadow-md lg:rounded-md pt-2  `}
        >
          <Outlet context={setLatestMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
