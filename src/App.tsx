import { Outlet } from "react-router-dom";
import Header from "./Components/Navigation/Header";
import Sidebar from "./Components/Navigation/Sidebar";

function App() {
  return (
    <>
      <Header />
      <Sidebar />
      <Outlet />
    </>
  );
}

export default App;
