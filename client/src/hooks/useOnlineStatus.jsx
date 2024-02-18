import { useContext } from "react";
import { OnlineStatusContext } from "../providers/OnlineStatusProvider";

const useOnlineStatus = () => {
  const onlineStatus = useContext(OnlineStatusContext);
  return onlineStatus;
};

export default useOnlineStatus;
