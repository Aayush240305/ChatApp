import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export default function Home() {
  const [Users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [online, setOnline] = useState([]);
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

  useEffect(() => {
    if (!user) return;

    const socket = io("http://localhost:4000", {
      withCredentials: true,
      auth: {
        id: user._id,
      },
    });

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server:", socket.id);
    });

    socket.on("online", (id) => {
      setOnline((prev) => (prev.includes(id) ? prev : [...prev, id]));
    });

    socket.on("offline", (id) => {
      setOnline((prev) => prev.filter((u) => u !== id));
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get("/chatApp/api/v1/user/getUserAll");
        setUsers(res.data.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error("You not have logged in!");
        navigate("/login");
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = Users.filter((user) =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-900 dark:to-black flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-4xl">
        {/* Top card / heading */}

        {/* Main card */}
        <div className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl border border-white/40 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300">
          {/* search bar */}
          <div className="border-b border-gray-200/70 dark:border-gray-800 px-4 sm:px-6 py-3 flex items-center gap-3 bg-gradient-to-r from-white/80 to-indigo-50/80 dark:from-gray-900 dark:to-gray-900/90">
            <div className="w-full">
              <input
                type="text"
                placeholder="🔍 Find Users..."
                className="w-full px-4 py-2.5 rounded-full bg-white/80 dark:bg-gray-800 text-sm sm:text-base text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* users list */}
          <div className="p-2 sm:p-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {filteredUsers.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm sm:text-lg py-10">
                {Users.length === 0
                  ? "Users लोड होत आहेत..."
                  : "कोणतेही users सापडले नाहीत 😅"}
              </p>
            ) : (
              <ul className="space-y-2 sm:space-y-3">
                {filteredUsers.map((user, index) => (
                  <li
                    key={index}
                    className="group flex items-center justify-between px-3 sm:px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-gray-800/90 hover:bg-indigo-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-700/70 hover:border-indigo-200 dark:hover:border-indigo-500/60 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/userChat/${user._id}`)}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="relative">
                        <img
                          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border border-white shadow-md"
                          src={
                            user.profilePhoto ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }
                          alt={user.fullName}
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-900 ${
                            online.includes(user._id)
                              ? "bg-green-400"
                              : "bg-gray-400"
                          }`}
                        ></span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate flex items-center gap-1">
                          {user.fullName || "Unknown User"}
                          {online.includes(user._id) && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300">
                              Online
                            </span>
                          )}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user.email || "No email available"}
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-xs sm:text-sm bg-indigo-500 group-hover:bg-indigo-600 text-white px-3 sm:px-4 py-1.5 rounded-full shadow-sm group-hover:shadow transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/userChat/${user._id}`);
                      }}
                    >
                      Message
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}