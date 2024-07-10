const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const connectedUsers = new Set();
let io;

const setupRealTimeService = (app) => {
  app.use(cors()); // Enable CORS
  const server = http.createServer(app);
  io = socketIo(server, {
    cors: {
      origin: "*", // Allow all origins
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
  });
  app.use((req, res, next) => {
    req.io = io;
    next();
  });
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      jwt.verify(socket.handshake.auth.token, "secretkey", (err, decoded) => {
        if (err) return next(new Error("Authentication error"));
        console.log("decoded:", decoded);
        socket.userId = decoded.userId;
        socket.username = decoded.username;
        console.log(
          "Socket user authenticated:",
          socket.username,
          socket.userId
        );
        next();
      });
    } else {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket) => {
    console.log("New client connected", socket.id);
    socket.on("clickSend", (message) => {
      const payload = { message, username: socket.username };
      socket.broadcast.emit("broadcastNotification", payload);
    });
    // connectedUsers.add(socket.id);
    await UserModel.findByIdAndUpdate(
      socket.userId,
      { connected: true, socketId: socket.id },
      { new: true }
    );

    // socket.on("broadcastNotification", (msg) => {
    //   console.log("Message received:", msg);
    //   socket.broadcast.emit("broadcastNotification", msg);
    // });

    socket.on("disconnect", async () => {
      await UserModel.findByIdAndUpdate(
        socket.userId,
        { connected: false, socketId: "" },
        { new: true }
      );
      connectedUsers.delete(socket.id);
      console.log("Client disconnected");
    });
  });

  server.listen(3001, () => {
    console.log("Real-time service running on port 3001");
  });
};

module.exports = { setupRealTimeService, getIo: () => io, connectedUsers };
