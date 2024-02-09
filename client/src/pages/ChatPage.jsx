import useAuthProvider from "../hooks/useAuthProvider";
import SideChats from "../components/SideChats";
import { Outlet } from "react-router-dom";

import useChatProvider from "../hooks/useChatProvider";
import Hero from "../components/Hero";

const ChatPage = () => {
  const { isSideChatOpen } = useChatProvider();
  const { user, userLoading } = useAuthProvider();

  if (userLoading) {
    return <div className="h-screen bg-white"></div>;
  }

  if (!user) {
    return <Hero />;
  }

  return (
    <div className="my-container h-screen  lg:py-4 relative">
      <div className="lg:flex h-full gap-2 ">
        <div
          className={`bg-white w-full h-full lg:w-[40%] lg:shadow-md  lg:rounded-md pt-2 px-2 absolute lg:static z-20  ${
            isSideChatOpen
              ? "top-0  left-0 "
              : "top-0 -left-[50rem] transition-all duration-500"
          }  `}
        >
          <SideChats />
        </div>

        <div
          className={`bg-white h-full flex-grow lg:shadow-md lg:rounded-md pt-2  `}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
