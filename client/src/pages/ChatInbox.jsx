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
  messageDate,
  messageTime,
} from "../logics/messageLogics";
import useAuthProvider from "../hooks/useAuthProvider";
import axios from "axios";
import AllMessages from "../components/AllMessages";

const ChatInbox = () => {
  const { user } = useAuthProvider();
  const { chatId } = useParams();
  const { setIsSideChatOpen, socket, typingStatus, isUserActive } =
    useChatProvider();

  const lastMessageRef = useRef();
  const [allMessages, setAllMessages] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [newMessage, setNewMessage] = useState(false);
  const [messagesFetched, setMessagesFetched] = useState(false);
  console.log(messagesFetched);
  const {
    data: singleChat,
    isLoading: singleChatLoading,
    error: singleChatError,
    refetch: singleChatRefetch,
  } = useGetChat(`/api/chat/${chatId}`);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const result = await axios.get(`/api/message/${chatId}`);

        setAllMessages(result?.data);
        setMessagesFetched(!!result?.data);
      } catch (error) {
        console.log(error?.response?.message);
      }
    };

    fetchMessages();
  }, [chatId]);

  // updating message readBy
  useEffect(() => {
    const updateMessageReadBy = async () => {
      try {
        const result = await axios.patch(
          `/api/message/${singleChat?.latestMessage?._id}`
        );
        console.log(result);
      } catch (error) {
        console.log(error?.response?.message);
      }
    };

    if (singleChat && !singleChat?.latestMessage?.readBy.includes(user?._id)) {
      updateMessageReadBy();
    }
  }, [singleChat, user]);

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
      <div className="shadow-sm w-full flex items-center gap-2  pb-1 px-2 lg:px-4 ">
        <NavigateBack />
        <div className="flex items-center  gap-2">
          {/* photo */}
          <div className="h-11 w-11 rounded-full  relative">
            {singleChatLoading ? (
              <div className="h-full w-full rounded-full bg-slate-200 skeleton"></div>
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
              <div className="h-8 w-28 rounded-xl skeleton bg-slate-200"></div>
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
            <div className="h-7 w-2 bg-slate-200 skeleton"></div>
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
          <AllMessages
            allMessages={allMessages}
            isGroupChat={singleChat?.isGroupChat}
          />
        )}

        {/* user typing indicator */}

        <div
          className="border-2 border-red-400"
          id="last-message"
          ref={lastMessageRef}
        >
          {typingStatus?.isTyping &&
            typingStatus?.user._id !== user?._id &&
            typingStatus?.chatId === singleChat?._id && (
              <div className="flex items-center gap-3">
                {/* user avatar */}
                <div className=" h-10 w-10 rounded-full overflow-hidden  ">
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={typingStatus?.user?.photoURL}
                    alt={`Profile photo of ${typingStatus?.user?.name}`}
                  />
                </div>

                <div
                  className={`bg-slate-200  shadow-md py-2 px-3 rounded-lg mb-2
          `}
                >
                  <span className="loading loading-dots loading-sm bg-slate-600"></span>
                </div>
              </div>
            )}
        </div>
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
