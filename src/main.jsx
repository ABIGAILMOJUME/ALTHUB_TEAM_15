import React from 'react'
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignUp from './Components/registration/SignUp.jsx'; 
import Login from './Components/registration/Login';
import ForgotPassword from './Components/registration/ForgotPassword';
import './index.css'
import App from './App'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {path: "forgot-password",
    element: <ForgotPassword />,
  },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
      { index: true, element: <SignUp /> },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
