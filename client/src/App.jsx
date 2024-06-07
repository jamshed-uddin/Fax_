import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";

function App() {
  const { pathname } = useLocation();

  return (
    <div>
      {!pathname.includes("/chat") && <Header />}
      <Outlet />
    </div>
  );
}

export default App;
