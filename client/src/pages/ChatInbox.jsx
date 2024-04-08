import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import NavigateBack from "../components/NavigateBack";
import useGetData from "../hooks/useGetData";
import InboxSkeleton from "../components/InboxSkeleton";
import WentWrong from "../components/WentWrong";
import Settings from "../components/Settings";
import SendMessage from "../components/SendMessage";
import { chatNameHandler, chatPhotoHandler } from "../logics/messageLogics";
import useAuthProvider from "../hooks/useAuthProvider";
import axios from "axios";
import useTheme from "../hooks/useTheme";

import useSocketProvider from "../hooks/useSocketProvider";
import Messages from "../components/Messages";
import Image from "../components/Image";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";

const ChatInbox = () => {
  const { dark } = useTheme();
  const { user } = useAuthProvider();
  const { chatId } = useParams();
  const { socket, typingStatus, isUserActive } = useSocketProvider();
  const [messages, setMessages] = useState([]);
  const [messageFetched, setMessageFetched] = useState(false);
  // image type messgae sending states
  const [imageFile, setImageFile] = useState(null);
  const [imageBlobURL, setImageBlobURL] = useState("");
  const [imageSendLoading, setImageSendLoading] = useState(false);
  const lastMessageRef = useRef();

  const {
    data: singleChat,
    isLoading: singleChatLoading,
    error: singleChatError,
    refetch: singleChatRefetch,
  } = useGetData(`/api/chat/${chatId}`);
  // console.log(singleChat);
  // console.log(messages);
  // console.log(imageBlobURL);

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

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ block: "end" });
    }
  }, [messages]);

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
      singleChat &&
      singleChat?.latestMessage &&
      !singleChat?.latestMessage?.readBy.includes(user?._id)
    ) {
      updateMessageReadBy();
    }
  }, [singleChat, user]);

  // recieve message from socket
  useEffect(() => {
    socket?.on("recieveMessage", (data) => {
      if (data.chat._id === chatId) {
        setMessages([...messages, data]);
      }
    });
  }, [chatId, messages, socket]);

  // toast style
  const toastStyle = {
    style: dark
      ? {
          background: "rgb(15 23 42)",
          color: "white",
          borderRadius: "20px",
          padding: "5px 10px",
        }
      : { borderRadius: "20px", padding: "5px 10px" },
  };

  // sending imageType message function
  const sendImageMessageHandler = async () => {
    if (!imageFile) {
      return;
    } else {
      const formData = new FormData();
      formData.append("chatId", chatId);
      formData.append("file", imageFile);
      try {
        setImageSendLoading(true);
        const result = await axios.post(
          "/api/message/newMessage?type=image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(result.data);
        setImageSendLoading(false);
        socket?.emit("sendMessage", result?.data);
        setImageBlobURL("");
      } catch (error) {
        console.log(error);
        toast("Something went wrong!", toastStyle);
        setImageSendLoading(false);
      }
    }
  };

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
          <Messages
            messages={messages}
            singleChat={singleChat}
            setMessages={setMessages}
          />
        )}
        {/* image message preview */}
        {imageBlobURL && (
          <div>
            <div className="flex items-center">
              <div className="ml-auto ">
                <Image image={imageBlobURL} loading={imageSendLoading} />
              </div>
              {imageBlobURL && (
                <div className="ml-2 flex flex-col gap-5 mt-1">
                  <button
                    type="button"
                    disabled={imageSendLoading}
                    onClick={() => setImageBlobURL("")}
                    className="cursor-pointer"
                  >
                    <XMarkIcon
                      className={`w-8 h-8 active:scale-90 ${
                        imageSendLoading ? "opacity-65" : "opacity-100"
                      }`}
                    />
                  </button>
                  <button
                    disabled={imageSendLoading}
                    type="button"
                    onClick={sendImageMessageHandler}
                  >
                    <PaperAirplaneIcon
                      className={`w-7 h-7 active:scale-90 cursor-pointer ${
                        imageSendLoading ? "opacity-65" : "opacity-100"
                      }`}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* user typing indicator */}
        <div id="last-message">
          {typingStatus?.isTyping &&
            typingStatus?.user._id !== user?._id &&
            typingStatus?.chatId === singleChat?._id && (
              <div className="flex items-end gap-2 mb-2">
                {/* user avatar */}
                <div className=" h-8 w-8 rounded-full overflow-hidden  ">
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={typingStatus?.user?.photoURL}
                    alt={`Profile photo of ${typingStatus?.user?.name}`}
                  />
                </div>

                <div
                  className={`${
                    dark ? "bg-slate-800" : "bg-slate-200"
                  } shadow-md py-[0.30rem] px-3 rounded-lg flex items-center
          `}
                >
                  <span
                    className={`loading loading-dots loading-sm ${
                      dark ? "bg-slate-200" : "bg-slate-800"
                    }`}
                  ></span>
                </div>
              </div>
            )}
        </div>
        <div ref={lastMessageRef}></div>
      </div>
      {/* send message input */}

      <SendMessage
        chat={singleChat}
        messages={messages}
        setImageBlobURL={setImageBlobURL}
        setImageFile={setImageFile}
      />
    </div>
  );
};

export default ChatInbox;
