import { UsersIcon } from "@heroicons/react/24/outline";
import ChatCard from "./ChatCard";
import { Link } from "react-router-dom";
import useChatProvider from "../hooks/useChatProvider";

const Chats = ({ chats }) => {
  const { setIsSideChatOpen } = useChatProvider();
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-2xl font-semibold mb-2">Chats</h1>
        <Link to={"/createGroup"}>
          <div
            onClick={() => setIsSideChatOpen(false)}
            className="flex items-center rounded-md bg-slate-200 px-2 py-[0.20rem]  "
          >
            <UsersIcon className="w-5 h-5 mr-1 " />
            <span className="font-medium">Create group</span>
          </div>
        </Link>
      </div>
      <div className="space-y-2">
        {chats?.map((chat, index) => (
          <div key={index}>
            <Link to={`inbox/${chat?._id}`}>
              <ChatCard key={chat._id} chat={chat} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chats;
