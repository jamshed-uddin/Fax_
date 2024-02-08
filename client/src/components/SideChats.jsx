import { useState } from "react";

import Searchbar from "./Searchbar";
import Users from "./Users";
import Chats from "./Chats";

import useChatProvider from "../hooks/useChatProvider";
import SideHeader from "./SideHeader";

const SideChats = () => {
  const [searchResult, setSearchResult] = useState([]);

  const { isSideChatOpen } = useChatProvider();
  console.log(isSideChatOpen);
  return (
    <div className="h-full overflow-y-auto relative">
      <div className="sticky top-0 left-0 right-0 z-20">
        <SideHeader />
      </div>
      <div className="h-max">
        <div className="py-1 mb-1">
          <Searchbar setSearchResult={setSearchResult} />
        </div>
        {/* search result */}

        <div>
          {!!searchResult?.users?.length && <Users />}
          {!!searchResult?.chats?.length && <Chats />}
        </div>

        {/* existing chats */}
        <div>
          <Chats
            chats={[
              1, 2, 3, 4, 5, 6, 7, 8, 9, 34, 23, 34, 23, 234, 243, 2423, 4, 323,
              24, 324,
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default SideChats;
