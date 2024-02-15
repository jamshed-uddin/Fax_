import React from "react";
import useAuthProvider from "../hooks/useAuthProvider";

const UserCard = ({ user, clickFunc = () => {} }) => {
  const { user: currentUser } = useAuthProvider();
  return (
    <div
      onClick={() => clickFunc(user?._id)}
      className="h-fit py-1 w-full rounded-lg  cursor-pointer select-none"
    >
      <div className="flex items-center gap-2 ">
        {/* image */}
        <div className="h-11 w-11 rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover  rounded-full"
            src={user?.photoURL}
            alt={user && `Profile image of ${user?.name}`}
          />
        </div>
        {/* other info */}
        <div>
          <h1 className="text-lg font-medium leading-4">
            {user?.name}{" "}
            {user._id === currentUser?._id && (
              <span className="text-xs"> (You)</span>
            )}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
