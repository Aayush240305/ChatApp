import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, EllipsisVertical } from "lucide-react";
import { io } from "socket.io-client";

export default function UserChat() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [myid, setmyid] = useState();

  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // API: user + messages
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`/chatApp/api/v1/user/getMessages/${id}`);
        setUser(res.data.data.requestedUser);
        setmyid(res.data.data.MyId);

        if (res.data.data.messages) {
          setMessages(res.data.data.messages);
        }
      } catch (err) {
        console.log("something went wrong", err);
      }
    }
    fetchUser();
  }, [id]);

  // Socket connect – myid आल्यानंतर
  useEffect(() => {
    if (!myid) return;

    socketRef.current = io("http://localhost:4000", {
      withCredentials: true,
      auth: {
        id: myid,
      },
    });

    socketRef.current.on("connect", () => {
      console.log("UserChat socket connected:", socketRef.current.id);
    });

    socketRef.current.on("disconnect", () => {
      console.log("UserChat socket disconnected");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [myid]);

  // receive_message
  useEffect(() => {
    if (!socketRef.current) return;

    const handleReceiveMessage = (message) => {
      if (
        (message.senderId === id && message.receiverId === myid) ||
        (message.senderId === myid && message.receiverId === id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socketRef.current.on("receive_message", handleReceiveMessage);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("receive_message", handleReceiveMessage);
      }
    };
  }, [id, myid]);

  // Auto scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current || !myid) return;

    const msgData = {
      senderId: myid,
      receiverId: id,
      text: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, msgData]);
    socketRef.current.emit("send_message", msgData);

    setNewMessage("");
  };

  const renderMessage = (msg, index) => {
    const senderId = msg.senderId || msg.sender || msg.from;
    const text = msg.text || msg.message || msg.content || "";
    const isMe = senderId === myid;

    return (
      <div
        key={msg._id || index}
        className={`w-full flex mb-2 sm:mb-3 ${
          isMe ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-[80%] sm:max-w-[65%] px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-sm sm:text-[15px] shadow-sm relative ${
            isMe
              ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-br-md"
              : "bg-white/90 backdrop-blur border border-gray-200/80 text-gray-900 rounded-bl-md"
          }`}
        >
          <p className="break-words leading-snug sm:leading-relaxed">{text}</p>
          <p
            className={`mt-1.5 text-[10px] sm:text-[11px] ${
              isMe ? "text-indigo-100/80" : "text-gray-500"
            } text-right`}
          >
            {msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-900 dark:to-black">
      {/* Top bar */}
      <nav className="px-3 sm:px-4 py-2.5 sm:py-3 sticky top-0 z-20 bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur border-b border-white/20 dark:border-gray-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-full hover:bg-white/10 transition"
            >
              <ArrowLeft color="white" className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <img
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-2 ring-white/70 dark:ring-gray-700 object-cover flex-shrink-0 shadow"
              src={
                user.profilePhoto ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
            />
            <div className="flex flex-col truncate">
              <h1 className="text-white font-semibold text-sm sm:text-base truncate">
                {user.fullName || "Guest User"}
              </h1>
              <span className="text-[11px] text-indigo-100">
                Private chat चालू आहे 💬
              </span>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition shadow-sm"
            >
              <EllipsisVertical color="white" className="w-5 h-5" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/80">
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user.fullName || "Guest User"}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email || "guest@example.com"}
                  </span>
                </div>
                <ul className="py-2 text-gray-700 dark:text-gray-200 text-sm max-h-60 overflow-y-auto">
                  <li className="px-4 py-2">
                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                      Bio:
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1 italic">
                      {user.bio || "No bio added"}
                    </p>
                  </li>
                  <li className="px-4 py-2 text-xs sm:text-sm border-t border-gray-100 dark:border-gray-800">
                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                      Joined on{" "}
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 italic">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Chat area */}
      <div className="flex-1 flex justify-center px-2 sm:px-4 pb-3">
        <div className="w-full max-w-5xl flex flex-col mt-2 sm:mt-3 rounded-3xl bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl border border-white/40 dark:border-gray-800 shadow-2xl overflow-hidden">
          {/* messages */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-3 sm:py-4 bg-gradient-to-b from-transparent via-white/60 to-white/80 dark:from-gray-900/80 dark:via-gray-900/90 dark:to-gray-900 custom-scrollbar">
            {messages && messages.length > 0 ? (
              <div className="flex flex-col">
                {messages.map((m, i) => renderMessage(m, i))}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm sm:text-base text-center px-6">
                अजून पर्यंत कोणतेही messages नाहीत, एक तरी message पाठवून बघ 🙂 
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* input */}
          <form
            onSubmit={handleSendMessage}
            className="px-3 sm:px-5 py-2.5 sm:py-3 bg-white/90 dark:bg-gray-900/95 border-t border-gray-200/70 dark:border-gray-800 flex items-center gap-2 sm:gap-3"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="इथे message टाईप कर..."
                className="w-full rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-all"
              disabled={!newMessage.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}