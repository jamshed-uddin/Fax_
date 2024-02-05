import { Link } from "react-router-dom";
import Searchbar from "./Searchbar";

import useAuthProvider from "../hooks/useAuthProvider";

const Header = () => {
  const { user } = useAuthProvider();
  return (
    <div className=" shadow">
      <div className="navbar  w-[97%] lg:w-[90%] mx-auto">
        <div className="flex-1">
          <Link to={"/"}>
            <span className="text-2xl font-bold">Chat</span>
          </Link>
        </div>
        {user ? (
          <div className="flex-none gap-2">
            <div className="dropdown dropdown-end">
              <Link to={"/profile"}>
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS Navbar component"
                      src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                    />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <Link to={"/signin"} className="btn btn-primary btn-sm">
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
