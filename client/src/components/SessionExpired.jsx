import useAuthProvider from "../hooks/useAuthProvider";
import useTheme from "../hooks/useTheme";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const SessionExpired = () => {
  const { dark } = useTheme();
  const { userLogout } = useAuthProvider();
  const navigate = useNavigate();

  const sendToSignInHandler = () => {
    let timeId = null;

    if (timeId) {
      clearTimeout(timeId);
    }

    timeId = setTimeout(() => {
      navigate("/signin");
    }, 500);

    userLogout();
  };

  return (
    <div
      className={`w-screen h-screen flex justify-center text-center items-center ${
        dark ? "bg-slate-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div>
        <h2 className="text-2xl font-semibold">Session expired</h2>
        <button
          onClick={sendToSignInHandler}
          className="text-xl font-medium btn btn-sm mt-3"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default SessionExpired;
