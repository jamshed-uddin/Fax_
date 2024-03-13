import { Link } from "react-router-dom";

import useTheme from "../hooks/useTheme";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

const Hero = () => {
  const { dark, toggleTheme } = useTheme();
  const signInBtnStyle = `btn btn-neutral btn-sm px-8 ${
    dark
      ? "bg-white text-gray-800 hover:bg-white hover:text-gray-800"
      : "text-white "
  }`;
  return (
    <div
      className={`${
        dark ? "bg-slate-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className={`my-container h-screen  `}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Fax_</h1>
          </div>
          <div className="mt-4 ml-2 flex items-center gap-4">
            <div className="cursor-pointer">
              {dark ? (
                <MoonIcon onClick={toggleTheme} className="h-5 w-5" />
              ) : (
                <SunIcon onClick={toggleTheme} className="w-5 h-5" />
              )}
            </div>
            <Link to={"/signin"} className={signInBtnStyle}>
              Sign in
            </Link>
          </div>
        </div>
        <div className="flex items-center h-[calc(100vh-4rem)]">
          <div>
            <h1 className="text-7xl font-bold lg:text-8xl lg:font-medium tracking-tighter ">
              <span className=" lg:block"> Connect </span>
              Empower Thrive
            </h1>
            <div className="mt-4 ml-2">
              <Link to={"/signin"} className={signInBtnStyle}>
                Sign in
              </Link>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
