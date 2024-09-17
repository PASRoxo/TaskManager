import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './Components/Navigation/ErrorPage';
import Dashboard from './Components/Dashboard';
import TasksList from './Components/Tasks/TasksList';
import TaskForm from './Components/Tasks/TaskForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/tasks',
        element: <TasksList />,
      },
      {
        path: '/newTask',
        element: <TaskForm />,
      },
      {
        path: '/tasks/:id',
        element: <TaskForm />,
      },
      {
        path: '/editTask/:id',
        element: <TaskForm />,
      },
    ]
  },
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);