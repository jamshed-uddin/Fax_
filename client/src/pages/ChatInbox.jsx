import { useEffect } from "react";
import { useParams } from "react-router-dom";

import useChatProvider from "../hooks/useChatProvider";
import { PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/outline";
import NavigateBack from "../components/NavigateBack";
import useGetChat from "../hooks/useGetChat";
import InboxSkeleton from "../components/InboxSkeleton";
import WentWrong from "../components/WentWrong";
import Settings from "../components/Settings";

const ChatInbox = () => {
  const { chatId } = useParams();
  const { setIsSideChatOpen } = useChatProvider();
  const {
    data: singleChat,
    isLoading: singleChatLoading,
    error: singleChatError,
    refetch: singleChatRefetch,
  } = useGetChat(`/api/chat/${chatId}`);

  console.log(singleChat);

  useEffect(() => {
    setIsSideChatOpen(!chatId);
  }, [chatId, setIsSideChatOpen]);

  if (singleChatError) {
    return <WentWrong refetch={singleChatRefetch} />;
  }

  return (
    <div className="h-full flex flex-col  ">
      {/* inbox header */}
      <div className="shadow-sm w-full flex items-center gap-2  pb-1 px-4 ">
        <NavigateBack />
        <div className="flex items-center gap-2">
          {/* photo */}
          <div className="h-11 w-11 rounded-full overflow-hidden">
            <img
              className="w-full h-full object-cover rounded-full"
              src={singleChat?.chatPhotoURL}
              alt={`Profile photo of ${singleChat?.chatName}`}
            />
          </div>
          {/* name */}
          <h1 className="text-xl font-medium leading-4">
            {singleChat?.chatName}
          </h1>
        </div>
        <div className="flex-grow flex justify-end">
          <Settings
            placedIn={"inbox"}
            settingsFor={singleChat?.isGroupChat ? "group" : "otherUser"}
            chatInfo={singleChat}
          />
        </div>
      </div>
      {/* messages */}
      <div className=" flex-grow overflow-y-auto px-3">
        {singleChatLoading ? (
          <InboxSkeleton />
        ) : (
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
        )}
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
