import useAuthProvider from "../hooks/useAuthProvider";
import {
  chatDate,
  chatNameHandler,
  chatPhotoHandler,
  isOwnMessage,
} from "../logics/messageLogics";
import useChatProvider from "../hooks/useChatProvider";

const ChatCard = ({ chat, clickFunc }) => {
  const { user } = useAuthProvider();
  const { isUserActive } = useChatProvider();

  console.log(chat);
  return (
    <div
      onClick={clickFunc}
      className="h-14 w-full rounded-lg  flex items-center gap-2"
    >
      {/* image */}
      <div className="h-11 w-11 rounded-full relative">
        <img
          className="w-full h-full object-cover rounded-full"
          src={
            chat?.isGroupChat
              ? chat?.chatPhotoURL
              : chatPhotoHandler(chat, user)
          }
          alt=""
        />
        {!chat?.isGroupChat && isUserActive(user, chat?.users) && (
          <div className="h-4 w-4 border-2 border-white bg-green-400 rounded-full absolute -bottom-[3px] -right-[3px] z-20"></div>
        )}
      </div>
      {/* other info */}
      <div className="flex-grow">
        <div className=" flex justify-between items-center">
          <h1 className="text-lg font-medium leading-4">
            {chat?.isGroupChat ? chat?.chatName : chatNameHandler(chat, user)}
          </h1>
          {/* last message date */}
          <h4 className="text-sm font-semibold">
            {chatDate(chat?.latestMessage.updatedAt)}
          </h4>
        </div>
        <h2
          className={`${
            !chat?.latestMessage.readBy.includes(user?._id) &&
            !isOwnMessage(chat?.latestMessage?.sender, user._id) &&
            "font-bold"
          }`}
        >
          {chat?.latestMessage?.sender?._id === user?._id
            ? `You: ${chat?.latestMessage?.content?.slice(0, 35)}...`
            : chat.isGroupChat
            ? `${
                chat?.latestMessage?.sender.name
              }: ${chat?.latestMessage?.content?.slice(0, 35)}...`
            : `${chat?.latestMessage?.content?.slice(0, 35)}...`}
        </h2>
      </div>
    </div>
  );
};

export default ChatCard;
