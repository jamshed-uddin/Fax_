import { PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import useAuthProvider from "../hooks/useAuthProvider";

import useSocketProvider from "../hooks/useSocketProvider";
import useOnlineStatus from "../hooks/useOnlineStatus";
import useTheme from "../hooks/useTheme";

const SendMessage = ({ chat, setImageBlobURL, setImageFile }) => {
  const { user } = useAuthProvider();
  const { dark } = useTheme();
  const { online } = useOnlineStatus();
  const [message, setMessage] = useState("");
  const [messageSending, setMessageSending] = useState(false);
  const { socket } = useSocketProvider();
  const textAreaRef = useRef(null);

  useEffect(() => {
    // for giving the message textarea a certain height
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  }, [message]);

  // input change handler
  const handleInputChange = (e) => {
    setMessage(e.target.value);

    const typingUser = chat?.users.find((u) => u._id === user?._id);

    socket?.emit("typingStatus", {
      user: typingUser,
      isTyping: true,
      chatId: chat?._id,
    });
  };

  const sendMessageHandler = async () => {
    if (!online || !message) return;
    const messageToSend = {
      content: message,
      chatId: chat?._id,
    };

    // sending to DB
    try {
      setMessageSending(true);
      const result = await axios.post("/api/message/newMessage", messageToSend);

      // sending message to socket
      socket?.emit("sendMessage", result?.data);

      // setMessages([...messages, result.data]);
      setMessage("");
      setMessageSending(false);
    } catch (error) {
      setMessageSending(false);
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 401)
      ) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Something went wrong");
      }
    }
  };

  const SeleteFile = (e) => {
    const file = e.target.files[0];

    if (file) {
      const blobURL = URL.createObjectURL(file);
      setImageBlobURL(blobURL);
      setImageFile(file);
    }
  };

  return (
    <div className=" flex items-end  gap-2 lg:px-3 mb-2 ">
      <div>
        <form encType="multipart/form-data">
          <label htmlFor="imageFile">
            <PhotoIcon
              className={`w-8 h-8 cursor-pointer active:scale-90 transition-transform duration-700 ${
                dark ? "white" : "text-slate-600"
              }`}
            />

            <input
              className="hidden"
              type="file"
              name="imageFile"
              id="imageFile"
              onChange={SeleteFile}
              accept="image/*"
            />
          </label>
        </form>
      </div>
      <textarea
        ref={textAreaRef}
        type="text"
        placeholder="Send message"
        className={`input w-full max-h-24  ${
          dark ? "" : "bg-gray-100"
        } py-1 overflow-auto focus:outline-0  ${
          !chat && "input-disabled"
        } resize-none`}
        rows={1}
        value={message}
        name="messageInput"
        onChange={handleInputChange}
      />

      <button disabled={!chat || messageSending} onClick={sendMessageHandler}>
        <PaperAirplaneIcon
          className={`w-8 h-8  active:scale-90 transition-transform duration-700 ${
            dark ? "white" : "text-slate-600"
          }`}
        />
      </button>
    </div>
  );
};

export default SendMessage;
