import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import useChatProvider from "./useChatProvider";
import useAuthProvider from "./useAuthProvider";
import { response } from "express";

const useGetData = (endpoint, enabled = true) => {
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

  axios.interceptors.response.use(
    (response) => {
      if (response.config.url === "/api/chat") {
        console.log("intercepted chat response");
      }
      return response;
    },
    (error) => {
      console.log(error);
      return Promise.reject(error);
    }
  );

  return useQuery({ queryKey, queryFn: fetchData, enabled: enabled && !!user });
};

export default useGetData;
