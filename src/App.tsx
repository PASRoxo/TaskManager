import './App.css'
import { Outlet } from "react-router-dom";
import Header from "./Components/Navigation/Header";
import Sidebar from "./Components/Navigation/Sidebar";
import { useState, useEffect } from "react";
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { fetchApiTasks, fetchApiTaskTypes } from './Features/tasksSlice';
import { fetchApiCategories } from './Features/categoriesSlice';

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
          <AppDataFetcher />
          <Outlet />
        </div>
      </div>
    </Provider>
  );
}

const AppDataFetcher = () => {
  const dispatch = useDispatch(); // Now inside the Provider context
  const thunkDispatch = useDispatch<ThunkDispatch<any, void, Action>>();

  useEffect(() => {
    thunkDispatch(fetchApiTasks());
    thunkDispatch(fetchApiTaskTypes());
    thunkDispatch(fetchApiCategories());
  }, [dispatch]);
  return null; // No need to render anything, just handle the fetching
};

export default App;
