import { useEffect } from "react";
import { useParams } from "react-router-dom";

import useChatProvider from "../hooks/useChatProvider";
import { PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/outline";
import NavigateBack from "../components/NavigateBack";
import useGetChat from "../hooks/useGetChat";
import InboxSkeleton from "../components/InboxSkeleton";
import WentWrong from "../components/WentWrong";
import Settings from "../components/Settings";
import SendMessage from "../components/SendMessage";

const ChatInbox = () => {
  const { chatId } = useParams();
  const { setIsSideChatOpen } = useChatProvider();
  const {
    data: singleChat,
    isLoading: singleChatLoading,
    error: singleChatError,
    refetch: singleChatRefetch,
  } = useGetChat(`/api/chat/${chatId}`);

  const {
    data: messages,
    isLoading: messagesLoading,
    error: messagesError,
    refetch: messagesRefetch,
  } = useGetChat(`/api/message/${chatId}`);

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
            {messages?.map((message) => (
              <div key={message._id} className="mb-6">
                {message.content}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* send message input */}
      <SendMessage chatId={chatId} messagesRefetch={messagesRefetch} />
    </div>
  );
};

export default ChatInbox;
