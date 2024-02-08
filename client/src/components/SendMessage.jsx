import { PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import React, { useState } from "react";

const SendMessage = ({ chatId, messagesRefetch }) => {
  const [message, setMessage] = useState("");

  console.log(message);

  const sendMessageHandler = async () => {
    try {
      const result = await axios.post("/api/message/newMessage", {
        content: message,
        chatId,
      });
      console.log(result);
      messagesRefetch();
      setMessage("");
    } catch (error) {
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

  return (
    <div className=" flex items-center  gap-2 lg:px-3 mb-2">
      <span>
        <PhotoIcon className="w-7 h-7 text-slate-600" />
      </span>
      <input
        type="text"
        placeholder="Send message"
        className="input input-bordered focus:outline-0 input-sm w-full "
        value={message}
        name="messageInput"
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessageHandler}>
        <PaperAirplaneIcon className="w-7 h-7 text-slate-600 active:scale-90 transition-transform duration-500" />
      </button>
    </div>
  );
};

export default SendMessage;
