import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import useTheme from "../hooks/useTheme";

const Searchbar = ({ searchQuery, setSearchQuery }) => {
  const { dark } = useTheme();
  const inputStyle = `input input-bordered focus:outline-0 focus:border-[1.3px] ${
    dark ? "focus:border-white" : "focus:border-black"
  }  input-sm w-full`;

  return (
    <div className="form-control  ">
      <div className="flex w-full items-center relative overflow-hidden  rounded-lg  py-1 pr-1">
        <span className=" mr-1">
          <MagnifyingGlassIcon className="w-6 h-6" />
        </span>
        <input
          type="text"
          placeholder="Search"
          className={inputStyle}
          name="searchInput"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          autoComplete="new-password"
        />
        {searchQuery && (
          <span
            onClick={() => setSearchQuery("")}
            className={`absolute right-2 top-1/2 -translate-y-1/2   rounded-lg  cursor-pointer ${
              dark ? "bg-gray-900" : "bg-white"
            }`}
          >
            <XMarkIcon className="w-6 h-6" />
          </span>
        )}
      </div>
    </div>
  );
};

export default Searchbar;
