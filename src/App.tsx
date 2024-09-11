import './App.css'
import { Outlet } from "react-router-dom";
import Header from "./Components/Navigation/Header";
import Sidebar from "./Components/Navigation/Sidebar";
import { useState } from "react";
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  const [sidebar, setSidebar] = useState(false)

  const showSidebar = () => {
    setSidebar(!sidebar)
  }
  return (
    <Provider store={store}>
      <Header />
      <div>
        <Sidebar sidebar={sidebar} showSidebar={showSidebar} />
        <div className={`content ${sidebar ? "op-sidebar" : "cl-sidebar"}`}>
          <Outlet />
        </div>
      </div>
    </Provider>
  );
}

export default App;
