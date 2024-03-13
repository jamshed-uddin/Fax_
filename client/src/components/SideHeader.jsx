import { MoonIcon, SunIcon, UserIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import useAuthProvider from "../hooks/useAuthProvider";
import useTheme from "../hooks/useTheme";
const SideHeader = () => {
  const { user } = useAuthProvider();
  const { dark, toggleTheme } = useTheme();

  return (
    <div
      className={`flex items-center justify-between   pb-1  mb-1 ${
        dark ? "bg-slate-900 text-white" : "bg-white"
      }`}
    >
      <div>
        <Link to={"/"}>
          <h1 className="text-3xl font-bold">Fax_</h1>
        </Link>
      </div>
      <div className="relative flex items-center gap-3">
        <div className="cursor-pointer">
          {dark ? (
            <MoonIcon onClick={toggleTheme} className="h-5 w-5" />
          ) : (
            <SunIcon onClick={toggleTheme} className="w-5 h-5" />
          )}
        </div>
        <div className="h-10 w-10">
          <Link to={`/profile/${user?._id}`}>
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
