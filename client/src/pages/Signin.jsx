import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthProvider from "../hooks/useAuthProvider";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, userSignIn } = useAuthProvider();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

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
    console.log(body);
    setLoading(true);

    try {
      await userSignIn(body).then((result) => {
        if (result) {
          setLoading(false);
          navigate("/");
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error?.message);
    }
  };

  return (
    <div className="">
      <div className=" h-[calc(100vh-7rem)] grid place-items-center">
        <div className=" w-full lg:w-[40%] mx-auto shadow-md  p-8 rounded-2xl">
          <h1 className="text-center text-3xl font-bold mb-4">Log in</h1>
          <form onSubmit={handleLogin} className="">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email *</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
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
                  className="input input-bordered w-full"
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
            {error && <span className="text-red-500 font-light">{error}</span>}
            <div className="form-control mt-6">
              <button
                disabled={loading}
                type="submit"
                className="btn btn-primary"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
            <div className="mt-2">
              <h1>
                New to chat?{" "}
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
