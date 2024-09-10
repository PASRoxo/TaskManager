import './App.css'
import { Outlet } from "react-router-dom";
import Header from "./Components/Navigation/Header";
import Sidebar from "./Components/Navigation/Sidebar";
import { useState } from "react";

function App() {
  const [sidebar, setSidebar] = useState(false)

  const showSidebar = () => {
    setSidebar(!sidebar)
  }
  return (
    <>
      <Header />
      <div>
        <Sidebar sidebar={sidebar} showSidebar={showSidebar} />
        <div className={`content ${sidebar ? "op-sidebar" : "cl-sidebar"}`}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
