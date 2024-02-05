import { useEffect } from "react";
import Hero from "../components/Hero";
import { useNavigate } from "react-router-dom";
import useAuthProvider from "../hooks/useAuthProvider";

const HomePage = () => {
  const { user } = useAuthProvider();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/chat");
    }
  }, [user, navigate]);

  return (
    <div>
      <Hero />
    </div>
  );
};

export default HomePage;
