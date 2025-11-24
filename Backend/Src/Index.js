import dotenv from 'dotenv'
import connectDB from './Database/Index.js'
import {app} from './App.js'
import { createServer } from "http";
import { Server } from "socket.io"

dotenv.config({
  path:'./.env'
})

const port = process.env.PORT || 4000
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

connectDB()
.then(()=>{
  httpServer.listen(port,()=>{
    console.log('Server is running at port :', port)
  })
})
.catch((e)=>{
  console.log("MongoDb connection failed",e);
})

io.on("connection", (socket) => {
  const id = socket.handshake.auth.id;
  console.log("User connected:", socket.id, "userId:", id);

  if (!id) return;

  // प्रत्येक user ला त्याचा स्वतःचा room
  socket.join(id);

  // online broadcast
  io.emit("online", id);

  // 🔹 private message event
  socket.on("send_message", (data) => {
    const { senderId, receiverId, text, createdAt } = data;
    console.log("Message:", data);

    // इथे DB मध्ये save करू शकतोस (Mongo वगैरे)

    // receiver च्या room ला message पाठव
    io.to(receiverId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    io.emit("offline", id);
  });
});
  

