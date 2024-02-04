import { useState } from "react";

const Searchbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  console.log(searchQuery);
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
