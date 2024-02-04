import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("Fill up the required fields");
    }

    const body = { email, password };
    console.log(body);
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
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password *</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                value={password}
                onChange={(e) => {
                  setError("");
                  setPassword(e.target.value);
                }}
              />
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
