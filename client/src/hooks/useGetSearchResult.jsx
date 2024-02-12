import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetSearchResult = (bouncedQuery) => {
  const queryKey = [bouncedQuery];

  const fetchData = async () => {
    try {
      const result = await axios.get(`/api/user?query=${bouncedQuery}`);
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

  return useQuery({ queryKey, queryFn: fetchData, enabled: !!bouncedQuery });
};

export default useGetSearchResult;
