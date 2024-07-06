import { Link } from "react-router-dom";

import useTheme from "../hooks/useTheme";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import obiWanKenobi from "../assets/obiwankenobi.jpg";
import anakinSkywalker from "../assets/anakinskywalker.jpg";

const Hero = () => {
  const { dark, toggleTheme } = useTheme();
  const signInBtnStyle = `btn btn-neutral btn-sm px-8 ${
    dark
      ? "bg-white text-gray-800 hover:bg-white hover:text-gray-800"
      : "text-white "
  }`;

  const textBubbleStyle = `w-fit  text-sm md:text-base shadow-md px-3 py-[0.35rem]  rounded-lg flex items-end ${
    dark ? "bg-slate-800" : "bg-slate-200"
  }`;
  return (
    <div
      className={`${
        dark ? "bg-slate-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className={`my-container h-screen  `}>
        {/* nav */}
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
        <div className="flex flex-col lg:flex-row items-center h-[calc(100vh-4rem)] ">
          <div className=" lg:w-[45%] shrink-0 order-last lg:order-first pb-16">
            <h1 className="text-7xl font-bold lg:text-8xl lg:font-medium tracking-tighter ">
              <span className=" lg:block"> Connect </span>
              Empower Thrive
            </h1>
            <div className="mt-4 ">
              <Link to={"/signin"} className={signInBtnStyle}>
                Sign in
              </Link>
            </div>
          </div>

          <div className=" lg:w-[55%] w-full mt-5 lg:mt-0 shrink-0 space-y-10 lg:space-y-20 ">
            {/* obi wan  */}
            <div className="lg:flex items-end gap-4 space-y-3">
              {/* image */}
              <div className="w-36 h-full">
                <img
                  className="w-full h-full object-cover rounded-xl"
                  src={obiWanKenobi}
                  alt="Obi wan kenobi"
                  loading="lazy"
                />
              </div>

              {/* chat head and chat bubble */}
              <div className="flex items-end gap-2">
                {/* chat head */}
                <div className="w-12 h-12 rounded-full">
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={obiWanKenobi}
                    alt="Obi wan kenobi"
                    loading="lazy"
                  />
                </div>

                {/* chat bubble */}
                <div className="space-y-2">
                  <h2 className={textBubbleStyle}>It's over Anakin.😐</h2>
                  <h2 className={textBubbleStyle}>I have the high ground😑</h2>
                </div>
              </div>
            </div>

            {/* anakin */}
            <div className="flex lg:flex-row  flex-col-reverse  items-end justify-end gap-4">
              {/* chat head and chat bubble */}
              <div className="flex items-center gap-2  ">
                {/* chat bubble */}
                <div>
                  <h2 className={textBubbleStyle}>
                    You underestimate my power...!😡
                  </h2>
                </div>
                {/* chat head */}
                <div className="w-12 h-12 rounded-full">
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={anakinSkywalker}
                    alt="Obi wan kenobi"
                    loading="lazy"
                  />
                </div>
              </div>
              {/* image */}
              <div className="w-36 h-full">
                <img
                  className="w-full h-full object-cover rounded-xl"
                  src={anakinSkywalker}
                  alt="Obi wan kenobi"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
