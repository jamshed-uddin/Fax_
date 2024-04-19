import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthProvider from "../hooks/useAuthProvider";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import useTheme from "../hooks/useTheme";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { dark } = useTheme();
  const { user, registerUser } = useAuthProvider();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      return setError("Fill up the required fields");
    } else if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    } else if (password.length < 6) {
      setError("Minimum password length is 6.");
      return;
    } else if (
      password === "123456" ||
      password.toLocaleLowerCase() === "password"
    ) {
      setError("Choose more secure password.");
      return;
    }

    const body = { name, email, password };

    setLoading(true);
    try {
      await registerUser(body);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      setError(error?.message);
    }
  };

  const btnStyle = `btn btn-neutral btn-sm px-8 ${
    dark
      ? "bg-white text-gray-800 hover:bg-white hover:text-gray-800"
      : "text-white "
  }`;

  const inputStyle = `input input-bordered focus:outline-0 focus:border-[1.3px] ${
    dark ? "focus:border-white" : "focus:border-black"
  }  input-md w-full`;

  return (
    <div
      className={`h-screen ${
        dark ? "bg-slate-900 text-white" : "bg-white text-gray-800 "
      }`}
    >
      <div className=" h-[calc(100vh-7rem)] grid place-items-center">
        <div className=" w-full lg:w-[40%] mx-auto lg:shadow-md  p-8 rounded-2xl">
          <h1 className="text-center text-3xl font-bold">Sign up</h1>
          <form onSubmit={handleRegister} className="">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name *</span>
              </label>
              <input
                type="text"
                placeholder="Name"
                className={inputStyle}
                value={name}
                onChange={(e) => {
                  setError("");
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email *</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className={inputStyle}
                value={email}
                onChange={(e) => {
                  setError("");
                  setEmail(e.target.value);
                }}
                autoComplete="none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password *</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  className={inputStyle}
                  value={password}
                  onChange={(e) => {
                    setError("");
                    setPassword(e.target.value);
                  }}
                  autoComplete="new-password"
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
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm password *</span>
              </label>
              <div className="relative ">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  className={inputStyle}
                  value={confirmPassword}
                  onChange={(e) => {
                    setError("");
                    setConfirmPassword(e.target.value);
                  }}
                  autoComplete="new-password"
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
            {error && (
              <span className="text-red-500 text-sm ml-1">{error}</span>
            )}
            <div className="form-control mt-6">
              <button disabled={loading} className={btnStyle}>
                {loading ? "Signing up..." : "Sign up"}
              </button>
            </div>
            <div className="mt-2">
              <h1>
                Already have an account?{" "}
                <Link to={"/signin"}>
                  <span className="text-blue-500 hover:underline">Sign in</span>
                </Link>
              </h1>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
