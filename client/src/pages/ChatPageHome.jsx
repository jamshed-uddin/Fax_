import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

const ChatPageHome = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center flex flex-col items-center">
        <ChatBubbleLeftRightIcon className="w-16 h-16" />
        <h1 className=" text-3xl">Start chat</h1>
      </div>
    </div>
  );
};

export default ChatPageHome;
