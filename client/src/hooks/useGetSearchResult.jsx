import React from "react";
import useDebounce from "./useDebouce";
import axios from "axios";
const useGetSearchResult = (searchQuery) => {
  const bouncedQuery = useDebounce(searchQuery, 600);

  console.log(bouncedQuery);

  try {
    const result = axios.get(`api/user?query=${bouncedQuery}`);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
  return bouncedQuery;
};

export default useGetSearchResult;
