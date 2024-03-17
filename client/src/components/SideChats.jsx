import { useState } from "react";
import Searchbar from "./Searchbar";
import SideHeader from "./SideHeader";
import MyChats from "./MyChats";
import SearchResult from "./SearchResult";
import useDebounce from "../hooks/useDebouce";
import useGetSearchResult from "../hooks/useGetSearchResult";
import { Link } from "react-router-dom";
import { UsersIcon } from "@heroicons/react/24/outline";
import useTheme from "../hooks/useTheme";

const SideChats = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const bouncedQuery = useDebounce(searchQuery, 600);
  const { data: searchResult, isLoading: searchLoading } =
    useGetSearchResult(bouncedQuery);
  const { dark } = useTheme();

  const btnStyle = `btn btn-neutral btn-sm px-3 ${
    dark
      ? "bg-white text-gray-800 hover:bg-white hover:text-gray-800"
      : "text-white "
  }`;

  return (
    <div className="h-full overflow-y-auto relative select-none">
      <div className="sticky top-0 left-0 right-0 z-20">
        <SideHeader />
      </div>
      <div className="h-max space-y-2">
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
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-xl font-semibold mb-2">Chats</h1>
          <Link to={"/createGroup"}>
            <div
              // onClick={() => setIsSideChatOpen(false)}
              className={`flex items-center rounded-md   py-[0.10rem]  `}
            >
              <button className={btnStyle}>
                <UsersIcon className="w-5 h-5  " /> Create group
              </button>
            </div>
          </Link>
        </div>
        <MyChats />
      </div>
    </div>
  );
};

export default SideChats;
