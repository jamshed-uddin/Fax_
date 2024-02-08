import { useEffect } from "react";
import { useParams } from "react-router-dom";

import useChatProvider from "../hooks/useChatProvider";
import { PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/outline";
import NavigateBack from "../components/NavigateBack";

const ChatInbox = () => {
  const { chatId } = useParams();
  const { setIsSideChatOpen } = useChatProvider();

  useEffect(() => {
    setIsSideChatOpen(!chatId);
  }, [chatId, setIsSideChatOpen]);

  return (
    <div className="h-full flex flex-col  ">
      {/* inbox header */}
      <div className="shadow-sm  flex items-center gap-2  pb-1 px-4">
        <NavigateBack />
        <div className="flex items-center gap-2">
          <div className="h-11 w-11 rounded-full bg-slate-200"></div>
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
      <div className=" flex items-center  gap-2 lg:px-3 mb-2">
        <span>
          <PhotoIcon className="w-7 h-7 text-slate-600" />
        </span>
        <input
          type="text"
          placeholder="Send message"
          className="input input-bordered focus:outline-0 input-sm w-full "
          name="messageInput"
        />

        <span>
          <PaperAirplaneIcon className="w-7 h-7 text-slate-600" />
        </span>
      </div>
    </div>
  );
};

export default ChatInbox;
