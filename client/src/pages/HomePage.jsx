import { useState } from "react";
import ChatPage from "./ChatPage";

import Hero from "../components/Hero";

const HomePage = () => {
  const [user] = useState(false);

  return <div>{user ? <ChatPage /> : <Hero />}</div>;
};

export default HomePage;
