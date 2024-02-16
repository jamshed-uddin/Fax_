import { useContext } from "react";
import { SocketContext } from "../providers/SocketProvider";

const useSocketProvider = () => {
  const value = useContext(SocketContext);
  return value;
};

export default useSocketProvider;
