import { useState, useEffect } from 'react'
import './App.css'
import Login from './Components/Login.jsx'
import SignUp from './Components/Signup.jsx'
import Home from './Components/Home.jsx'
import Navbar from './Components/Navbar.jsx'
import UserChat from './Components/userChat.jsx'
import { ToastContainer} from 'react-toastify';
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function App() {
  
  const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <>
          <Navbar/>
          <Home />
        </>
      )
    },
    {
     path: "/login",
      element: <Login/> 
    },
    {
     path: "/signUp",
      element: <SignUp /> 
    },
    {
     path:"/userChat/:id" ,
     element:<UserChat />
    }
  ]
)

  return (
    <div className="bg-gray-950">
      <RouterProvider router =  {router} />
      <ToastContainer />
     </div>
  )
}

export default App
