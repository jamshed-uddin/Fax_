import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="my-container h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Fax_</h1>
        </div>
        <div className="mt-4 ml-2">
          <Link
            to={"/signin"}
            className="btn btn-neutral btn-sm px-8 text-white"
          >
            Sign in
          </Link>
        </div>
      </div>
      <div className="flex items-center h-[calc(100vh-4rem)]">
        <div>
          <h1 className="text-8xl font-medium tracking-tighter">
            Connect <br />
            Empower Thrive
          </h1>
          <div className="mt-4 ml-2">
            <Link
              to={"/signin"}
              className="btn btn-neutral btn-sm px-8 text-white"
            >
              Sign in
            </Link>
          </div>
        </div>
        <div> </div>
      </div>
    </div>
  );
};

export default Hero;
