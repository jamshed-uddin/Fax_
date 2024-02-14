import CardSkeleton from "./CardSkeleton";
import Users from "./Users";
import Chats from "./Chats";
import { Link } from "react-router-dom";
import { UsersIcon } from "@heroicons/react/24/outline";

const SearchResult = ({ query, searchResult, searchLoading }) => {
  const { users, chats } = searchResult;

  if (query && searchLoading) {
    return <CardSkeleton cardAmount={3} />;
  }

  if (query.length && !searchLoading && !users?.length && !chats?.length) {
    return (
      <div>
        <h1 className="text-center">No user or chat found</h1>
      </div>
    );
  }

  return (
    <div>
      {!!users?.length && <Users users={users} />}
      {!!chats?.length && (
        <div>
          <div className="flex justify-between items-center mb-1">
            <h1 className="text-2xl font-semibold mb-2">Chats</h1>
            <Link to={"/createGroup"}>
              <div
                // onClick={() => setIsSideChatOpen(false)}
                className={`flex items-center rounded-md  px-2 py-[0.20rem]  text-sm font-medium btn btn-sm `}
              >
                <UsersIcon className="w-5 h-5  " />
                <span className="">Create group</span>
              </div>
            </Link>
          </div>
          <Chats chats={chats} />
        </div>
      )}
    </div>
  );
};

export default SearchResult;
