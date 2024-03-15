import { useState } from "react";
import useTheme from "../hooks/useTheme";
import axios from "axios";
import Modal from "../components/Modal";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { dark } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);

  const btnStyle = `btn btn-neutral btn-sm px-8 ${
    dark
      ? "bg-white text-gray-800 hover:bg-white hover:text-gray-800"
      : "text-white "
  }`;

  const handleForgotPassRequest = async () => {
    if (!email) {
      return setError("Valid email required");
    }
    setLoading(true);
    try {
      const result = await axios.post("/api/user/forgotPassword", {
        email,
      });
      console.log(result.data);
      setModalOpen(true);
    } catch (error) {
      if (error.response.status === 401) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong!");
      }

      setLoading(false);
    }
    setLoading(false);
  };
  return (
    <div
      className={`my-container flex justify-center items-center  h-screen  ${
        dark ? "bg-slate-900 text-white" : "bg-white text-gray-800 "
      } `}
    >
      <Modal
        isModalOpen={modalOpen}
        setIsModalOpen={setModalOpen}
        modalFor={"emailLinkSendModal"}
      ></Modal>
      <div className="w-[85%] lg:w-2/5 mx-auto ">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Having problem siging in?
        </h1>
        <div className="form-control">
          <label className="label">
            <span className=" text-lg font-semibold">Enter your email</span>
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
          {error && <span className="text-red-500 text-sm ml-1">{error}</span>}
          <div className="form-control mt-3">
            <button
              disabled={loading}
              type="submit"
              className={btnStyle}
              onClick={handleForgotPassRequest}
            >
              {loading ? "Sending sign in link..." : "Send sign in link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
