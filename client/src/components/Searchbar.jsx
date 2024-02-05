import { useState } from "react";
import useGetSearchResult from "../hooks/useGetSearchResult";

const Searchbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const result = useGetSearchResult(searchQuery);
  console.log(result);
  return (
    <div className="form-control">
      <input
        type="text"
        placeholder="Search"
        className="input input-bordered input-sm w-24 md:w-auto"
        name="searchInput"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default Searchbar;
