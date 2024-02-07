import React from "react";
import UserCard from "./UserCard";

const Users = ({ users }) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Users</h1>
      <div className="space-y-2">
        {[1, 23, 4, 5]?.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Users;
