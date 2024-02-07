import React from "react";

const UserCard = ({ user }) => {
  return (
    <div className="h-14 w-full rounded-lg ">
      <div className="flex items-center gap-2 ">
        {/* image */}
        <div className="h-12 w-12 rounded-full bg-slate-200"></div>
        {/* other info */}
        <div>
          <h1 className="text-lg font-medium leading-4">user name</h1>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
