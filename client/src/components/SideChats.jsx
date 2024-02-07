import React, { useState } from "react";
import { Link } from "react-router-dom";
import Searchbar from "./Searchbar";
import Users from "./Users";
import Chats from "./Chats";

import useChatProvider from "../hooks/useChatProvider";

const SideChats = ({ setHideSideChat }) => {
  const [searchResult, setSearchResult] = useState([]);

  const { isSideChatOpen } = useChatProvider();
  console.log(isSideChatOpen);
  return (
    <div className="h-full overflow-y-auto">
      <div className="h-max">
        <div className="p-1 mb-1">
          <Searchbar setSearchResult={setSearchResult} />
        </div>
        {/* search result */}

        <div>
          {!!searchResult?.users?.length && <Users />}
          {!!searchResult?.chats?.length && <Chats />}
        </div>

        {/* existing chats */}
        <div>
          <Chats chats={[1, 2, 3, 4, 5, 6, 7, 8, 9, 34, 23, 34]} />
        </div>
      </div>
    </div>
  );
};

export default SideChats;
