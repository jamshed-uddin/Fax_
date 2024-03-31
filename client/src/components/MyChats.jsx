import useGetData from "../hooks/useGetData";
import CardSkeleton from "./CardSkeleton";
import WentWrong from "./WentWrong";
import Chats from "./Chats";
import useChatProvider from "../hooks/useChatProvider";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

const MyChats = () => {
  const { myChats, myChatsLoading, myChatsError, myChatsRefetch } =
    useChatProvider();
  console.log(myChats);
  if (myChatsLoading) {
    return <CardSkeleton cardAmount={5} />;
  }

  if (myChatsError) {
    return <WentWrong refetch={myChatsRefetch} />;
  }

  return (
    <div>
      {myChats?.length ? (
        <Chats chats={myChats} placedIn={"chatList"} />
      ) : (
        <div className="text-center text-lg  mt-20">
          <div className="flex flex-col items-center">
            <ChatBubbleLeftRightIcon className="w-8 h-8" />
            <h1>Search user and start chat</h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyChats;
