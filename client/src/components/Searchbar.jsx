/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import useDebounce from "../hooks/useDebouce";
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
const Searchbar = ({ setSearchResult }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const bouncedQuery = useDebounce(searchQuery, 600);
  const [loading, setLoading] = useState(false);
  // const [searchResult, setSearchResult] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if (!bouncedQuery) return;
      setLoading(true);
      try {
        const result = await axios.get(`api/user?query=${bouncedQuery}`);
        console.log(result);
        setSearchResult(result.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    fetchData();
  }, [bouncedQuery, setSearchResult]);

  return (
    <div className="form-control">
      <div className="flex w-full items-center relative overflow-hidden  rounded-lg">
        <span className=" mx-1">
          {searchQuery ? (
            <ArrowLeftIcon className="w-5 h-5" />
          ) : (
            <MagnifyingGlassIcon className="w-6 h-6" />
          )}
        </span>
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered input-sm w-full "
          name="searchInput"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
        />
        {searchQuery && (
          <span
            onClick={() => setSearchQuery("")}
            className=" absolute right-1 top-1/2 -translate-y-1/2 bg-white  rounded-lg  cursor-pointer"
          >
            <XMarkIcon className="w-6 h-6" />
          </span>
        )}
      </div>
    </div>
  );
};

export default Searchbar;
