import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { io } from "socket.io-client";


export default function Home() {
  const [Users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState(false)
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const[online, setOnline] = useState([])
  
    useEffect(()=>{
      async function fetchUser() {
      try {
        const res = await axios.get("/chatApp/api/v1/user/getUser");
        setUser(res.data.data);
       } catch (err) {
        console.error("Error fetching user:", err);
      }
    }
    fetchUser();
  },[])
  
useEffect(()=>{
  if(!user) return;
    const socket = io('http://localhost:4000', {
     withCredentials: true,
     auth:{
      id : user._id
    }
  });
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id)
    })
  socket.on("disconnect",()=>{
     console.log("disConnected to server:", socket.id)
   })
   socket.on("online", id => setOnline(prev => [...prev, id]));
   socket.on("offline", id => setOnline(prev => prev.filter(u => u !== id)));
  },[user])

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get("/chatApp/api/v1/user/getUserAll");
        setUsers(res.data.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error("You not have logged in!")
        navigate('/login');
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = Users.filter((user) =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black py-10 px-6">
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="🔍 Search users..."
          className="w-full p-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl  transition-all duration-300  p-2 sm:p-6">
        {filteredUsers.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg animate-pulse">
            {Users.length === 0
              ? "Loading users..."
              : "No users found 😅"}
          </p>
        ) : (
          <ul className="space-y-4">
            {filteredUsers.map((user, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-indigo-100 to-pink-100 dark:from-gray-700 dark:to-gray-800 hover:scale-[1.02] transition-all duration-300 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img class="w-10 h-10 rounded-full" src={user.profilePhoto} alt="" />
                    <span className={`top-0 left-7 absolute  w-3.5 h-3.5  border-2 border-white dark:border-gray-800 rounded-full ${online.includes(user._id)?"bg-green-400":"bg-gray-400"
                    }`}></span>
                   </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-lg">
                      {user.fullName || "Unknown User"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      {user.email || "No email available"}
                    </p>
                  </div>
                </div>
                <button className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-full shadow-md transition-all" onClick={()=>{
                  navigate(`/userChat/${user._id}`)
                }}>
                  Message
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}