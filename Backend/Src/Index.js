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
  const id = socket.handshake.auth.id
  console.log("User connected:",socket.id,id)
  io.emit("online", id)

socket.on("disconnect",() =>{
  console.log("User disconnected:", socket.id)
  io.emit("offline",id)
 })
})
  

