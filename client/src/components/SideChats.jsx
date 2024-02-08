import { useState } from "react";

import Searchbar from "./Searchbar";
import Users from "./Users";
import Chats from "./Chats";
import SideHeader from "./SideHeader";
import CardSkeleton from "./CardSkeleton";
import useChatProvider from "../hooks/useChatProvider";

const SideChats = () => {
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { myChats, myChatsLoading } = useChatProvider();
  return (
    <div className="h-full overflow-y-auto relative">
      <div className="sticky top-0 left-0 right-0 z-20">
        <SideHeader />
      </div>
      <div className="h-max">
        <div className="py-1 mb-1">
          <Searchbar
            setSearchResult={setSearchResult}
            setSearchLoading={setSearchLoading}
            setIsSearching={setIsSearching}
          />
        </div>
        {/* search result */}
        {searchLoading && isSearching ? (
          <CardSkeleton cardAmount={3} />
        ) : !searchResult?.users?.length &&
          !searchResult?.users?.length &&
          isSearching ? (
          <div>
            <h1 className="text-center">No user or chat found</h1>
          </div>
        ) : (
          <div>
            {!!searchResult?.users?.length && (
              <Users users={searchResult?.users} />
            )}
            {!!searchResult?.chats?.length && (
              <Chats chats={searchResult?.chats} />
            )}
          </div>
        )}

        {/* existing chats */}
        <div>
          <Chats chats={myChats} />
        </div>
      </div>
    </div>
  );
};

export default SideChats;
