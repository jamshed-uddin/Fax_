import { createContext, useEffect, useState } from "react";

export const OnlineStatusContext = createContext(null);
const OnlineStatusProvider = ({ children }) => {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const onlineHandler = () => setOnline(true);
    const offlineHandler = () => setOnline(false);

    window.addEventListener("online", onlineHandler);

    window.addEventListener("offline", offlineHandler);

    return () => {
      window.removeEventListener("online", onlineHandler);

      window.removeEventListener("offline", offlineHandler);
    };
  }, []);
  const value = {
    online,
  };

  return (
    <OnlineStatusContext.Provider value={value}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

export default OnlineStatusProvider;
