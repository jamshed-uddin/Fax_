import React from "react";

const UserCard = ({ user, clickFunc }) => {
  return (
    <div
      onClick={() => clickFunc(user?._id)}
      className="h-14 w-full rounded-lg  cursor-pointer"
    >
      <div className="flex items-center gap-2 ">
        {/* image */}
        <div className="h-11 w-11 rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover  rounded-full"
            src={user?.photoURL}
            alt={`Profile image of ${user?.name}`}
          />
        </div>
        {/* other info */}
        <div>
          <h1 className="text-lg font-medium leading-4">{user?.name}</h1>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
