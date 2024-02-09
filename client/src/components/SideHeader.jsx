import { MoonIcon, SunIcon, UserIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthProvider from "../hooks/useAuthProvider";
const SideHeader = () => {
  const { user } = useAuthProvider();
  const [dark, setDark] = useState(false);

  return (
    <div className="flex items-center justify-between bg-white  pb-1  mb-1">
      <div>
        <h1 className="text-2xl font-bold">CHAT</h1>
      </div>
      <div className="relative flex items-center gap-2">
        <div className="cursor-pointer">
          {dark ? (
            <SunIcon onClick={() => setDark((p) => !p)} className="w-5 h-5" />
          ) : (
            <MoonIcon onClick={() => setDark((p) => !p)} className="h-5 w-5" />
          )}
        </div>
        <div className="h-9 w-9">
          <Link to={`/profile/${user?._id}`} replace={true}>
            <span>
              <UserIcon className="w-full h-full  rounded-full p-1" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideHeader;
