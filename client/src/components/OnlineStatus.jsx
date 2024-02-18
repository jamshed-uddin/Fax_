import { SignalIcon, SignalSlashIcon } from "@heroicons/react/24/outline";
import useOnlineStatus from "../hooks/useOnlineStatus";
import { useEffect, useState } from "react";
import useTheme from "../hooks/useTheme";

const OnlineStatus = () => {
  const { online } = useOnlineStatus();
  const { dark } = useTheme();
  const [hideStatus, setHideStatus] = useState(false);

  useEffect(() => {
    if (!online) {
      return setHideStatus(false);
    }

    if (online) {
      setTimeout(() => {
        setHideStatus(true);
      }, 3000);
    }
  }, [hideStatus, online]);
  console.log(hideStatus);

  return (
    <div
      className={`${
        hideStatus
          ? "hidden"
          : "absolute z-50 top-0 left-0 right-0  text-sm text-center"
      }`}
    >
      <div
        className={`text-xs md:text-sm flex justify-center ${
          dark ? "text-white" : "text-black"
        }`}
      >
        {online ? (
          <h5 className="flex items-center gap-1">
            <SignalIcon className="w-4 h-4" /> <span>Connection restored</span>
          </h5>
        ) : (
          <h5 className="flex items-center gap-1">
            <SignalSlashIcon className="w-4 h-4" /> <span>You are offline</span>
          </h5>
        )}
      </div>
    </div>
  );
};

export default OnlineStatus;
