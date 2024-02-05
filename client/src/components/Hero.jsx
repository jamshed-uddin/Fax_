import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="my-container grid place-items-center h-[calc(100vh-6rem)]">
      <div>
        <h1>hero section</h1>
        <Link to={"/signin"} className="btn btn-primary btn-sm">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Hero;
