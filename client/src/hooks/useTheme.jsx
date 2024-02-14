import React, { useContext } from "react";
import { ThemeContext } from "../providers/ThemeProvider";

const useTheme = () => {
  const themeInfo = useContext(ThemeContext);

  return themeInfo;
};

export default useTheme;
