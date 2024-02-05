import React, { useState } from "react";
import { Link } from "react-router-dom";
import Searchbar from "./Searchbar";

const SideChats = () => {
  const [searchResult, setSearchResult] = useState(null);

  console.log(searchResult);
  return (
    <div>
      <div className="p-1">
        <Searchbar setSearchResult={setSearchResult} />
      </div>
      {/* search result */}
      <div className="transition-all duration-500 ">
        {searchResult?.map((user) => (
          <div key={user?._id}>
            <Link to={`inbox/${user?._id}`}>
              <div className="h-24 w-full bg-red-500 rounded-xl mb-3 text-white">
                <h1>{user?.name}</h1>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div>
        <h1>chats</h1>
        {[
          1, 2, 3, 4, 5, 6, 7, 8, 3, 4, 2, 3, 4, 4, 5, 5, 6, 6, 7, 5, 4, 4, 4,
        ].map((el, index) => (
          <div key={index}>
            <Link to={`inbox/${el}`}>
              <div className="h-24 w-full bg-slate-500 rounded-xl mb-3"></div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideChats;
