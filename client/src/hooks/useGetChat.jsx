import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

const useGetChat = (endpoint) => {
  const queryKey = [endpoint];

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

  return useQuery({ queryKey, queryFn: fetchData });
};

export default useGetChat;