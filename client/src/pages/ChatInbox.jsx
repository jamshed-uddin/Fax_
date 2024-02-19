import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import NavigateBack from "../components/NavigateBack";
import useGetChat from "../hooks/useGetChat";
import InboxSkeleton from "../components/InboxSkeleton";
import WentWrong from "../components/WentWrong";
import Settings from "../components/Settings";
import SendMessage from "../components/SendMessage";
import {
  chatDate,
  chatNameHandler,
  chatPhotoHandler,
  isOwnMessage,
  isUsersLastMessage,
  messageTime,
} from "../logics/messageLogics";
import useAuthProvider from "../hooks/useAuthProvider";
import axios from "axios";
import useTheme from "../hooks/useTheme";

import useSocketProvider from "../hooks/useSocketProvider";

const ChatInbox = () => {
  const { dark } = useTheme();
  const { user } = useAuthProvider();
  const { chatId } = useParams();
  const { socket, typingStatus, isUserActive } = useSocketProvider();
  const [messages, setMessages] = useState([]);
  const [messageFetched, setMessageFetched] = useState(false);
  const lastMessageRef = useRef();

  const {
    data: singleChat,
    isLoading: singleChatLoading,
    error: singleChatError,
    refetch: singleChatRefetch,
  } = useGetChat(`/api/chat/${chatId}`);

  // fetching messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const result = await axios.get(`/api/message/${chatId}`);

        setMessages(result?.data);
        setMessageFetched(!!result?.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [chatId]);

  // updating message readBy
  useEffect(() => {
    const updateMessageReadBy = async () => {
      try {
        await axios.patch(`/api/message/${singleChat?.latestMessage?._id}`);
      } catch (error) {
        console.log(error?.response?.message);
      }
    };

    if (
      singleChat?.users.length !== singleChat?.latestMessage?.readBy.length &&
      singleChat &&
      singleChat?.latestMessage &&
      !singleChat?.latestMessage?.readBy.includes(user?._id)
    ) {
      updateMessageReadBy();
    }
  }, [singleChat, user]);

  // recieve message from socket
  useEffect(() => {
    console.log(socket);
    socket?.on("recieveMessage", (data) => {
      if (data.chat._id === chatId) {
        setMessages([...messages, data]);
      }
    });
  }, [chatId, messages, socket]);

  // last message into view
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView();
    }
  }, [messages]);

  // scrolling into last sent message for sender only
  useEffect(() => {
    if (messages.at(-1)?.sender._id !== user?._id) return;
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView();
    }
  }, [messages, user]);

  if (singleChatError) {
    return <WentWrong refetch={singleChatRefetch} />;
  }

  const themeWiseBg = `${dark ? "bg-slate-800" : "bg-slate-200"}`;

  return (
    <div className="h-full w-full flex flex-col  ">
      {/* inbox header */}
      <div className="shadow-sm w-full flex items-center gap-2  pb-1 px-2 lg:px-4 ">
        <NavigateBack />
        <div className="flex items-center  gap-2">
          {/* photo */}
          <div className="h-11 w-11 rounded-full  relative">
            {singleChatLoading ? (
              <div
                className={`h-full w-full rounded-full  skeleton ${themeWiseBg}`}
              ></div>
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
            {singleChatLoading ? (
              <div
                className={`h-8 w-28 rounded-xl skeleton ${themeWiseBg} `}
              ></div>
            ) : (
              <>
                <h1 className="text-xl font-medium ">
                  {chatNameHandler(singleChat, user)}
                </h1>
              </>
            )}
          </div>
        </div>
        <div className="flex-grow flex justify-end">
          {singleChatLoading ? (
            <div className={`h-7 w-2  skeleton ${themeWiseBg}`}></div>
          ) : (
            <Settings
              placedIn={"inbox"}
              settingsFor={singleChat?.isGroupChat ? "group" : "otherUser"}
              chatInfo={singleChat}
            />
          )}
        </div>
      </div>
      {/* messages */}
      <div className=" flex-grow overflow-y-auto lg:px-4 mb-2">
        {singleChatLoading ? (
          <InboxSkeleton />
        ) : (
          <div className="h-max  py-2  w-full ">
            {messages?.map((message, index, msgArr) => (
              <div
                key={message._id}
                className={`flex items-end mb-2 ${
                  isOwnMessage(message?.sender, user?._id)
                    ? "justify-end "
                    : "justify-start "
                } ${message?.type === "event" ? "justify-center" : ""} `}
              >
                {/* user avatar */}
                {!isOwnMessage(message?.sender, user?._id) && (
                  <div className=" h-9 w-9 rounded-full overflow-hidden  ">
                    {isUsersLastMessage(msgArr, index, message) && (
                      <img
                        className="w-full h-full object-cover rounded-full"
                        src={message?.sender?.photoURL}
                        alt={`Profile photo of `}
                      />
                    )}
                  </div>
                )}
                {/* message text */}
                <div className=" ml-2 max-w-[75%] ">
                  {!isOwnMessage(message?.sender, user?._id) &&
                    isUsersLastMessage(msgArr, index, message, "first") &&
                    singleChat?.isGroupChat && (
                      <div className="text-xs ml-1">
                        {message?.sender?.name}
                      </div>
                    )}
                  <div
                    className={`  w-full  text-sm md:text-base shadow-md px-3 py-[0.35rem]  rounded-lg flex items-end ${
                      dark ? "bg-slate-800" : "bg-slate-200"
                    } ${
                      message?.type === "event"
                        ? "bg-transparent shadow-none items-center "
                        : ""
                    }`}
                  >
                    <div className="flex-grow">
                      {message?.type === "event" && message?.sender?.name}{" "}
                      {message?.content}
                    </div>
                    <div className="shrink-0 text-end  text-[0.60rem] ml-2 -mb-2 -mr-1 ">
                      {chatDate(message?.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* user typing indicator */}

        <div id="last-message">
          {typingStatus?.isTyping &&
            typingStatus?.user._id !== user?._id &&
            typingStatus?.chatId === singleChat?._id && (
              <div className="flex items-end gap-3">
                {/* user avatar */}
                <div className=" h-10 w-10 rounded-full overflow-hidden  ">
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={typingStatus?.user?.photoURL}
                    alt={`Profile photo of ${typingStatus?.user?.name}`}
                  />
                </div>

                <div
                  className={`bg-slate-200  shadow-md py-[0.30rem] px-3 rounded-lg mb-2 flex items-center
          `}
                >
                  <span className="loading loading-dots loading-sm bg-slate-600"></span>
                </div>
              </div>
            )}
        </div>
        <div ref={lastMessageRef}></div>
      </div>
      {/* send message input */}
      <SendMessage chat={singleChat} messages={messages} />
    </div>
  );
};

export default ChatInbox;
