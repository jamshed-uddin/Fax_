import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import useChatProvider from "../hooks/useChatProvider";

import NavigateBack from "../components/NavigateBack";
import useGetChat from "../hooks/useGetChat";
import InboxSkeleton from "../components/InboxSkeleton";
import WentWrong from "../components/WentWrong";
import Settings from "../components/Settings";
import SendMessage from "../components/SendMessage";
import {
  chatNameHandler,
  chatPhotoHandler,
  isOwnMessage,
  isUsersLastMessage,
} from "../logics/messageLogics";
import useAuthProvider from "../hooks/useAuthProvider";
import axios from "axios";

const ChatInbox = () => {
  const { user } = useAuthProvider();
  const { chatId } = useParams();
  const { setIsSideChatOpen, socket, typingStatus, lastSeen, isUserActive } =
    useChatProvider();

  const messageRef = useRef();

  const [allMessages, setAllMessages] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [newMessage, setNewMessage] = useState(false);

  const {
    data: singleChat,
    isLoading: singleChatLoading,
    error: singleChatError,
    refetch: singleChatRefetch,
  } = useGetChat(`/api/chat/${chatId}`);

  // scroll to the end when send new message and in initail render
  useEffect(() => {
    const messageInbox = document.getElementById("messages");

    messageInbox?.scrollIntoView();
    messageInbox?.scrollIntoView(false);
    messageInbox?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [newMessage]);

  useEffect(() => {
    // if (allMessages?.at(-1)?.sender._id === user?._id) return;
    const messageInbox = document.getElementById("message-container");

    messageInbox.scrollTop = messageInbox?.scrollHeight;
  }, [allMessages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const result = await axios.get(`/api/message/${chatId}`);

        setAllMessages(result?.data);
        socket?.emit("joinRoom", chatId);
      } catch (error) {
        console.log(error?.response?.message);
      }
    };

    fetchMessages();
  }, [chatId, socket]);

  // send message to socket
  useEffect(() => {
    if (!user || sendMessage === null) return;

    socket?.emit("sendMessage", sendMessage);
  }, [sendMessage, socket, user]);

  // recieve message from socket
  useEffect(() => {
    socket?.on("recieveMessage", (data) => {
      console.log(data);
      if (data !== null && data.chatId === chatId) {
        setAllMessages([...allMessages, data]);
      }
    });
  }, [socket, chatId, allMessages]);

  //  side chat close or open for mobile
  useEffect(() => {
    setIsSideChatOpen(!chatId);
  }, [chatId, setIsSideChatOpen]);

  if (singleChatError) {
    return <WentWrong refetch={singleChatRefetch} />;
  }

  return (
    <div className="h-full w-full flex flex-col  bg-white">
      {/* inbox header */}
      <div className="shadow-sm w-full flex items-center gap-2  pb-1 px-4 ">
        <NavigateBack />
        <div className="flex items-center  gap-2">
          {/* photo */}
          <div className="h-11 w-11 rounded-full  relative">
            {singleChatLoading ? (
              <div className="h-full w-full rounded-full bg-slate-200"></div>
            ) : (
              <img
                className="w-full h-full object-cover rounded-full"
                src={chatPhotoHandler(singleChat, user)}
                alt={`Profile photo of ${singleChat?.chatName}`}
              />
            )}

            {!singleChat?.isGroupChat &&
              isUserActive(user, singleChat?.users) && (
                <div className="h-4 w-4 border-2 border-white bg-green-400 rounded-full absolute -bottom-[3px] -right-[3px] z-20"></div>
              )}
          </div>
          {/* name */}
          <div>
            <h1 className="text-xl font-medium ">
              {chatNameHandler(singleChat, user)}
            </h1>
            <h1 className="text-sm  leading-3">
              Last seen {lastSeen(new Date(), new Date())}
            </h1>
          </div>
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
        id="message-container"
        className=" flex-grow overflow-y-auto lg:px-4 mb-2"
      >
        {singleChatLoading ? (
          <InboxSkeleton />
        ) : (
          <div id="messages" className="h-max  py-2  w-full ">
            {allMessages?.map((message, index, msgArr) => (
              <div
                key={message._id}
                className={`chat flex items-center ${
                  isOwnMessage(message?.sender, user?._id)
                    ? "justify-end chat-end "
                    : "justify-start chat-start"
                }`}
              >
                {/* user avatar */}
                {!isOwnMessage(message?.sender, user?._id) && (
                  <div className=" h-10 w-10 rounded-full overflow-hidden  ">
                    {!isUsersLastMessage(msgArr, index, message) &&
                      !isOwnMessage(message?.sender, user?._id) && (
                        <img
                          className="w-full h-full object-cover rounded-full"
                          src={message?.sender.photoURL}
                          alt={`Profile photo of ${singleChat?.chatName}`}
                        />
                      )}
                  </div>
                )}
                {/* message text */}
                <div
                  className={` bg-slate-200 text-black text-sm md:text-base shadow-md max-w-[70%] ${
                    isUsersLastMessage(msgArr, index, message)
                      ? "p-2 rounded-lg"
                      : "p-2 rounded-lg mb-2"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {/* user typing indicator */}
            {typingStatus?.isTyping &&
              typingStatus.user._id !== user?._id &&
              typingStatus?.chatId === singleChat._id && (
                <div className="flex items-center gap-3">
                  {/* user avatar */}
                  <div className=" h-10 w-10 rounded-full overflow-hidden  ">
                    <img
                      className="w-full h-full object-cover rounded-full"
                      src={typingStatus?.user?.photoURL}
                      alt={`Profile photo of ${typingStatus?.user?.name}`}
                    />
                  </div>

                  {/* message text */}
                  <div
                    className={`flex items-end bg-slate-200  shadow-md p-2 px-3 rounded-lg mb-2
                    `}
                  >
                    <span className="loading loading-dots loading-sm bg-slate-800"></span>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
      {/* send message input */}
      <SendMessage
        chat={singleChat}
        setSendMessage={setSendMessage}
        setAllMessages={setAllMessages}
        setNewMessage={setNewMessage}
      />
    </div>
  );
};

export default ChatInbox;
