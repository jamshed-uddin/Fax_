import CardSkeleton from "./CardSkeleton";
import Users from "./Users";
import Chats from "./Chats";

const SearchResult = ({ query, searchResult, searchLoading }) => {
  const { users, chats } = searchResult;
  console.log(users, chats);

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
      {!!chats?.length && <Chats chats={chats} />}
    </div>
  );
};

export default SearchResult;
