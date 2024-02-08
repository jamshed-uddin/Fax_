/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import useDebounce from "../hooks/useDebouce";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";

const Searchbar = ({ setSearchResult, setIsSearching, setSearchLoading }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [inputOnFocus, setInputOnFocus] = useState(false);
  const bouncedQuery = useDebounce(searchQuery, 600);

  // useEffect(() => {
  //   setIsSearching(!!searchQuery);
  // }, [searchQuery, setIsSearching]);

  useEffect(() => {
    setSearchLoading(true);
    if (!inputOnFocus) return;

    const fetchData = async () => {
      try {
        const result = await axios.get(`/api/user?query=${bouncedQuery}`);
        console.log(result);
        setSearchResult(result.data);
        setSearchLoading(false);
      } catch (error) {
        setSearchLoading(false);
        console.log(error);
      }
    };

    fetchData();
  }, [bouncedQuery, inputOnFocus, setSearchLoading, setSearchResult]);

  return (
    <div className="form-control  ">
      <div className="flex w-full items-center relative overflow-hidden  rounded-lg  py-1 pr-1">
        <span className=" mr-1">
          <MagnifyingGlassIcon className="w-6 h-6" />
        </span>
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered focus:outline-0 input-sm w-full "
          name="searchInput"
          value={searchQuery}
          onFocus={() => setInputOnFocus(true)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearching(e.target.value);
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
