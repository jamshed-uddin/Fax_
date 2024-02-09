import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import useChatProvider from "../hooks/useChatProvider";
import { PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/outline";
import NavigateBack from "../components/NavigateBack";
import useGetChat from "../hooks/useGetChat";
import InboxSkeleton from "../components/InboxSkeleton";
import WentWrong from "../components/WentWrong";
import Settings from "../components/Settings";
import SendMessage from "../components/SendMessage";
import {
  chatPhotoHandler,
  isOwnMessage,
  isUsersLastMessage,
} from "../logics/messageLogics";
import useAuthProvider from "../hooks/useAuthProvider";

const ChatInbox = () => {
  const { user } = useAuthProvider();
  const { chatId } = useParams();
  const { setIsSideChatOpen } = useChatProvider();
  const messageRef = useRef();
  const [scrollToEnd, setScrollToEnd] = useState(false);

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

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [scrollToEnd]);

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
            {singleChatLoading ? (
              <div className="h-full w-full rounded-full bg-slate-200"></div>
            ) : (
              <img
                className="w-full h-full object-cover rounded-full"
                src={chatPhotoHandler(singleChat, user)}
                alt={`Profile photo of ${singleChat?.chatName}`}
              />
            )}
          </div>
          {/* name */}
          <h1 className="text-xl font-medium leading-4">
            {singleChat?.users[0]._id === user?._id
              ? singleChat?.users[1].name
              : singleChat?.users[0].name}
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
      <div
        ref={messageRef}
        className=" flex-grow overflow-y-auto px-4 mb-2 flex items-end "
      >
        {singleChatLoading ? (
          <InboxSkeleton />
        ) : (
          <div className="h-max  py-2  w-full ">
            {messages?.map((message, index, msgArr) => (
              <div
                key={message._id}
                className={`chat flex items-end ${
                  isOwnMessage(message.sender, user?._id)
                    ? "justify-end chat-end "
                    : "justify-start chat-start"
                }`}
              >
                {/* user avatar */}
                {!isOwnMessage(message.sender, user?._id) && (
                  <div className="h-10 w-10 rounded-full overflow-hidden  ">
                    {!isUsersLastMessage(msgArr, index, message) &&
                      !isOwnMessage(message.sender, user?._id) && (
                        <img
                          className="w-full h-full object-cover rounded-full"
                          src={message.sender.photoURL}
                          alt={`Profile photo of ${singleChat?.chatName}`}
                        />
                      )}
                  </div>
                )}
                {/* message text */}
                <div
                  className={`  bg-slate-200 text-black shadow-md ${
                    isUsersLastMessage(msgArr, index, message)
                      ? "p-2 px-3 rounded-lg"
                      : "p-2 px-3  chat-bubble rounded-lg"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* send message input */}
      <SendMessage
        setScrollToEnd={setScrollToEnd}
        chatId={chatId}
        messagesRefetch={messagesRefetch}
      />
    </div>
  );
};

export default ChatInbox;
