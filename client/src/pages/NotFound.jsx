import { Link } from "react-router-dom";
import useTheme from "../hooks/useTheme";

const NotFound = () => {
  const { dark } = useTheme();
  console.log(dark);

  return (
    <div
      className={`h-screen grid place-items-center ${
        dark ? "bg-slate-900 text-white" : "bg-white"
      }`}
    >
      <div className="text-center">
        <h1 className="text-8xl mb-2">404</h1>
        <h1 className="text-2xl mb-1">Page not found</h1>
        <Link to={"/"}>
          <span className="underline">Get back</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
