const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoutes");
const messageRoute = require("./routes/messageRoutes");
const dotenv = require("dotenv");
const { notFound, errorHandler } = require("./middlewares/errorMiddlewares");
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  pingtimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send("mern chat is running");
});

app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

let activeUsers = [];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(userId);
  console.log(`${userId} is connected`);

  if (userId) {
    activeUsers.push({ userId: userId, socketId: socket.id });
  }
  console.log(activeUsers);

  // emiting active users
  io.emit("activeUsers", activeUsers);

  console.log(activeUsers);

  socket.on("joinChat", (user) => {
    socket.join(user._id);
    console.log(`${user?.name} joined the chat`);
  });
  // send message
  socket.on("sendMessage", (data) => {
    const { chat } = data;
    console.log(data);
    if (chat.users.length) {
      chat.users.forEach((user) => {
        if (user._id === data.sender._id) return;
        socket.in(user._id).emit("recieveMessage", data);
        console.log("message sent");
      });
    }
  });

  // typing status
  let timer;
  socket.on("typingStatus", (data) => {
    io.emit("typing", data);
    clearTimeout(timer);
    timer = setTimeout(() => {
      io.emit("typing", { ...data, isTyping: false });
    }, 3000);
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log(`${userId} is disconnected`);
    io.emit("activeUsers", activeUsers);
  });
});
console.log(activeUsers);
app.use(notFound);
app.use(errorHandler);

server.listen(port, () => {
  console.log(`chat app is running on port ${port}`);
});
