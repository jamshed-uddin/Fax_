import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useChatProvider from "../hooks/useChatProvider";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const ChatInbox = () => {
  const { chatId } = useParams();
  const { setIsSideChatOpen } = useChatProvider();
  const navigate = useNavigate();
  useEffect(() => {
    setIsSideChatOpen(!chatId);
  }, [chatId, setIsSideChatOpen]);

  return (
    <div className="h-full flex flex-col  ">
      {/* inbox header */}
      <div className="shadow-sm  flex items-center gap-3  py-1 px-3">
        <div
          className="cursor-pointer "
          onClick={() => {
            navigate(-1);
            setIsSideChatOpen(true);
          }}
        >
          <ArrowLeftIcon className="w-6 h-6 " />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-slate-200"></div>
          <h1 className="text-xl font-medium leading-4">user info {chatId}</h1>
        </div>
        <div></div>
      </div>
      {/* messages */}
      <div className=" flex-grow overflow-y-auto px-3">
        <div className="h-max">
          <h1 className="text-center">messages</h1>
          {[
            1, 2, 3, 4, 5, 6, 7, 8, 34, 213, 245, 45, 234, 13, 32, 42, 66, 77,
            88, 99, 33, 22, 11, 55, 232, 13241, 3424, 35235,
          ].map((el) => (
            <div key={el} className="mb-6">
              {el}
            </div>
          ))}
        </div>
      </div>
      {/* send message input */}
      <div className=" flex items-center ">
        <input
          type="text"
          placeholder="Send message"
          className=" border-[1px] border-black focus:border-[1px] focus:border-black focus:outline-0  w-full rounded-lg input input-md "
          name="messageInput"
        />

        <span className="border-2 border-black rounded-xl px-3 py-1">Send</span>
      </div>
    </div>
  );
};

export default ChatInbox;
