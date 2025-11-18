import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft,EllipsisVertical } from 'lucide-react';

export default function UserChat() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`/chatApp/api/v1/user/getMessages/${id}`);
        setUser(res.data.data);
      } catch (err) {
        console.log("something went wrong", err);
      }
    }
    fetchUser();
  }, [id]);

  return (
    <div>
      <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-gray-800 dark:via-gray-900 dark:to-black shadow-md px-4 py-3">
  <div className="max-w-screen-xl mx-auto flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Link to="/"><ArrowLeft color="white" className="w-6 h-6" /></Link>
      <img
        className="w-10 h-10 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 object-cover"
        src={user.profilePhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
        alt="Profile"
      />
      <h1 className="text-white font-semibold text-lg">{user.fullName || "Guest User"}</h1>
    </div>
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition"
      >
        <EllipsisVertical color="white" />
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 animate-fadeIn z-50">
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
              <span className="font-semibold text-gray-800 dark:text-gray-100">Bio:</span>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 italic">{user.bio || "No bio added"}</p>
            </li>
            <li className="px-4 py-2 text-sm">
              <span className="font-semibold text-gray-800 dark:text-gray-100">Joined in : </span>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 italic">{
                user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"
              }</p>
            </li>
          </ul>
        </div>
      )}
    </div>
  </div>
</nav>
    </div>
  );
}