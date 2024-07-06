import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthProvider from "../hooks/useAuthProvider";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import useTheme from "../hooks/useTheme";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, userSignIn } = useAuthProvider();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { dark } = useTheme();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("Fill up the required fields");
    }

    const body = { email, password };

    setLoading(true);

    try {
      await userSignIn(body).then((result) => {
        if (result) {
          setLoading(false);
          navigate("/");
        }
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error?.message);
    }
  };

  const btnStyle = `btn btn-neutral btn-sm px-8 ${
    dark
      ? "bg-white text-gray-800 hover:bg-white hover:text-gray-800"
      : "text-white "
  }`;

  return (
    <div
      className={`h-screen ${
        dark ? "bg-slate-900 text-white" : "bg-white text-gray-800 "
      }`}
    >
      <div className=" h-[calc(100vh-7rem)] grid place-items-center">
        <div className="w-full lg:w-[40%] mx-auto lg:shadow-md  p-8 rounded-2xl">
          <h1 className="text-center text-3xl font-bold mb-4">Log in</h1>
          <form onSubmit={handleLogin} className="">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email *</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className={`input input-bordered focus:outline-0 focus:border-[1.3px] ${
                  dark ? "focus:border-white" : "focus:border-black"
                }  input-md w-full`}
                value={email}
                onChange={(e) => {
                  setError("");
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="form-control ">
              <label className="label">
                <span className="label-text">Password *</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  className={`input input-bordered focus:outline-0 focus:border-[1.3px] ${
                    dark ? "focus:border-white" : "focus:border-black"
                  }  input-md w-full`}
                  value={password}
                  onChange={(e) => {
                    setError("");
                    setPassword(e.target.value);
                  }}
                />
                <div
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-red-500 text-sm ml-1">{error}</div>
              <div className="text-blue-500 hover:underline ">
                <Link to={"/forgotPassword"}>Forgot password?</Link>
              </div>
            </div>
            <div className="form-control mt-6">
              <button disabled={loading} type="submit" className={btnStyle}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
            <div className="mt-2">
              <h1>
                New to Fax_?{" "}
                <Link to={"/signup"}>
                  <span className="text-blue-500 hover:underline">Sign up</span>
                </Link>
              </h1>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
