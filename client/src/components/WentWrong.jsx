import React from "react";

const WentWrong = ({ refetch }) => {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="flex flex-col items-center">
        <h1 className="text-lg">Something went wrong</h1>
        <h4
          className="bg-slate-100  rounded-lg mt-1 cursor-pointer px-3 "
          onClick={refetch}
        >
          Try again
        </h4>
      </div>
    </div>
  );
};

export default WentWrong;
