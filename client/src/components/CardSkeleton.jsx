import React from "react";

const CardSkeleton = ({ cardAmount }) => {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5, 6, 7].slice(0, cardAmount).map((el) => (
        <div
          key={el}
          className="skeleton bg-slate-200 h-14 w-full  rounded-lg "
        ></div>
      ))}
    </div>
  );
};

export default CardSkeleton;
