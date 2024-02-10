import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";

const Searchbar = ({ searchQuery, setSearchQuery }) => {
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
