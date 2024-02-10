import React from "react";
import useGetChat from "../hooks/useGetChat";
import CardSkeleton from "./CardSkeleton";
import WentWrong from "./WentWrong";
import Chats from "./Chats";

const MyChats = () => {
  const {
    data: myChats,
    isLoading: myChatsLoading,
    error: myChatsError,
    refetch: myChatsRefetch,
  } = useGetChat("/api/chat");

  if (myChatsLoading) {
    return <CardSkeleton cardAmount={5} />;
  }

  if (myChatsError) {
    return <WentWrong refetch={myChatsRefetch} />;
  }

  return (
    <div>
      {myChats?.length ? (
        <Chats chats={myChats} />
      ) : (
        <div className="text-center text-lg">
          <div>
            <h1>Search user and start chat</h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyChats;
