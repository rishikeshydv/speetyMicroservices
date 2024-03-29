import http from 'http';
import express from 'express';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log('Server Running and A New User Added')

  // //handling chat messages
  // socket.on("chat-message", (message: string) => {
  //   io.emit("chat-message", message);
  // })

  socket.on("disconnected", () => {
    console.log("User Disconnected")
  })
})

server.listen(3001, () => {
  console.log('Server running on Port 3001')
})
