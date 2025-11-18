import React, { useState, useEffect } from "react";
import axios from "axios";
import Logo from "../assets/Logo.jpg";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Navbar() {
  const [user, setUser] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("/chatApp/api/v1/user/getUser");
        setUser(res.data.data);
       } catch (err) {
        console.error("Error fetching user:", err);
      }
    }
    fetchUser();
  }, []);
  
  async function handleLogout(){
    try{
      const res = await axios.post("/chatApp/api/v1/user/logout")
      toast.success(res.data.message)
      navigate('/login');
    } catch(err){
      toast.error("Something went wrong")
    }
  }

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-gray-800 dark:via-gray-900 dark:to-black shadow-lg">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto px-2 py-2">
        <div className="flex items-center space-x-3">
          <img
            src={Logo}
            className="h-14 w-14  shadow-md"
            alt="Logo"
          />
          <span className="self-center text-2xl font-semibold text-white tracking-wide">
            Chat App
          </span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all duration-300 p-1.5 rounded-full focus:ring-2 focus:ring-pink-300"
          >
            <img
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
              src={user.profilePhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="user avatar"
            />
            <span className="hidden sm:block text-white font-medium">
              {user.fullName?.split(" ")[0] || "Guest"}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-56 ring-1 ring-gray-200 dark:ring-gray-700 animate-fadeIn">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                  {user.fullName || "Guest User"}
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email || "guest@example.com"}
                </span>
              </div>

              <ul className="py-2 text-gray-700 dark:text-gray-200">
                <li className="px-4 py-2 text-sm">
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    Bio:
                  </span>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 italic">
                    {user.bio || "No bio added"}
                  </p>
                </li>
                <li className="px-4 py-2 text-sm">
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    Joined in:
                  </span>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 italic">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </li>
                <hr className="border-gray-200 dark:border-gray-700 my-2" />
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg w-full text-left"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}