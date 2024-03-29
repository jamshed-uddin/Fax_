import CardSkeleton from "./CardSkeleton";
import Users from "./Users";
import Chats from "./Chats";

const SearchResult = ({ query, searchResult, searchLoading }) => {
  const { users, chats } = searchResult;

  if (query && searchLoading) {
    return <CardSkeleton cardAmount={2} />;
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
            <h1 className="text-xl font-semibold mb-2">Chats</h1>
          </div>
          <Chats chats={chats} placedIn={"searchResult"} />
        </div>
      )}
    </div>
  );
};

export default SearchResult;
