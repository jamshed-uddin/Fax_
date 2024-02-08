import { useEffect, useState } from "react";
import {
  ArrowLeftStartOnRectangleIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import useAuthProvider from "../hooks/useAuthProvider";
const UserSettings = () => {
  const [isSettingsOpen, setIsSettingOpen] = useState(false);
  const { userLogout } = useAuthProvider();
  const navigate = useNavigate();
  const userLogoutHandler = () => {
    userLogout();
    navigate("/");
  };

  useEffect(() => {
    const outsideClickHandler = (e) => {
      if (
        isSettingsOpen &&
        !document.getElementById("settings").contains(e.target)
      ) {
        setIsSettingOpen((p) => !p);
      }
    };

    document.addEventListener("mousedown", outsideClickHandler);

    return () => {
      document.removeEventListener("mousedown", outsideClickHandler);
    };
  }, [isSettingsOpen]);

  return (
    <div id="settings" className="relative ">
      <div
        onClick={() => setIsSettingOpen((p) => !p)}
        className={`cursor-pointer transition-transform duration-500 active:scale-90 pl-3`}
      >
        <Cog6ToothIcon className="h-7 w-7 " />
      </div>
      <div
        className={`absolute w-max top-8 right-0 bg-white py-2 px-3  shadow-md rounded-xl  ${
          isSettingsOpen ? "opacity-100 block h-max " : "opacity-0 hidden h-0"
        }`}
      >
        <ul className="text-lg  space-y-1">
          <Link to={"/profile"}>
            <li className="hover:bg-slate-100 px-3 py-1 rounded-xl flex items-center gap-1">
              <PencilSquareIcon className="w-5 h-5 " />
              <span>Edit profile</span>
            </li>
          </Link>

          <li
            onClick={userLogoutHandler}
            className="hover:bg-slate-100 px-3 py-1 rounded-xl flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeftStartOnRectangleIcon className="w-5 h-5 inline" /> Logout
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserSettings;
