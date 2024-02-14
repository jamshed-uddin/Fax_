import { createContext, useEffect, useState } from "react";
export const ThemeContext = createContext(null);
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("chat-theme")
      ? localStorage.getItem("chat-theme")
      : "light"
  );

  useEffect(() => {
    localStorage.setItem("chat-theme", theme);

    const chatTheme = localStorage.getItem("chat-theme");
    document.querySelector("html").setAttribute("data-theme", chatTheme);
  }, [theme]);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const dark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
