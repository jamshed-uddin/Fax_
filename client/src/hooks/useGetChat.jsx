import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import useChatProvider from "./useChatProvider";
import useAuthProvider from "./useAuthProvider";

const useGetChat = (endpoint, enabled = true) => {
  const { user } = useAuthProvider();

  const { isSideChatOpen } = useChatProvider();
  const queryKey = [endpoint, isSideChatOpen];

  const fetchData = async () => {
    try {
      const result = await axios.get(endpoint);
      return result.data;
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 401)
      ) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Something went wrong");
      }
    }
  };

  return useQuery({ queryKey, queryFn: fetchData, enabled: enabled && !!user });
};

export default useGetChat;
