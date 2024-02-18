import { PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useState } from "react";
import useAuthProvider from "../hooks/useAuthProvider";

import useSocketProvider from "../hooks/useSocketProvider";
import useOnlineStatus from "../hooks/useOnlineStatus";

const SendMessage = ({ chat }) => {
  const { user } = useAuthProvider();
  const { online } = useOnlineStatus();
  const [message, setMessage] = useState("");

  const { socket } = useSocketProvider();

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
      const result = await axios.post("/api/message/newMessage", messageToSend);
      console.log(result.data);
      // sending message to socket
      socket?.emit("sendMessage", result?.data);

      // setMessages([...messages, result.data]);
      setMessage("");
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 401)
      ) {
        // console.log(error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        // console.log(error);
        throw new Error("Something went wrong");
      }
    }
  };

  return (
    <div className=" flex items-center  gap-2 lg:px-3 mb-2">
      <span>
        <PhotoIcon className="w-7 h-7 text-slate-600" />
      </span>
      <input
        type="text"
        placeholder="Send message"
        className={`input input-bordered focus:outline-0 input-sm w-full ${
          !chat && "input-disabled"
        }`}
        value={message}
        name="messageInput"
        onChange={handleInputChange}
      />

      <button disabled={!chat} onClick={sendMessageHandler}>
        <PaperAirplaneIcon className="w-7 h-7 text-slate-600 active:scale-90 transition-transform duration-500" />
      </button>
    </div>
  );
};

export default SendMessage;
