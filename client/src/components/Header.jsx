import { Link } from "react-router-dom";

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

        {!user && (
          <Link to={"/signin"} className="btn btn-primary btn-sm">
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
