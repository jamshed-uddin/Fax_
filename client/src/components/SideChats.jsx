import { useState } from "react";
import Searchbar from "./Searchbar";
import SideHeader from "./SideHeader";
import MyChats from "./MyChats";
import SearchResult from "./SearchResult";
import useDebounce from "../hooks/useDebouce";
import useGetSearchResult from "../hooks/useGetSearchResult";

const SideChats = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const bouncedQuery = useDebounce(searchQuery, 600);
  const { data: searchResult, isLoading: searchLoading } =
    useGetSearchResult(bouncedQuery);

  return (
    <div className="h-full overflow-y-auto relative">
      <div className="sticky top-0 left-0 right-0 z-20">
        <SideHeader />
      </div>
      <div className="h-max">
        <div className="py-1 mb-1">
          <Searchbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        {/* search result */}
        <SearchResult
          searchLoading={searchLoading}
          searchResult={searchResult || {}}
          query={bouncedQuery}
        />

        {/* existing chats */}
        <MyChats />
      </div>
    </div>
  );
};

export default SideChats;
