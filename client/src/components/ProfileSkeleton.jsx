import React from "react";
import NavigateBack from "./NavigateBack";

const ProfileSkeleton = () => {
  return (
    <>
      <div className="px-5">
        <NavigateBack />
      </div>
      <div className=" flex justify-center mt-12  ">
        <div className="  ">
          <div className="skeleton bg-slate-200 h-40 w-40 rounded-full shrink-0"></div>
          <div className=" mt-4 gap-2 flex flex-col items-center">
            <div className="skeleton h-6 w-full bg-slate-200"></div>
            <div className="skeleton h-4 w-28 bg-slate-200"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSkeleton;
