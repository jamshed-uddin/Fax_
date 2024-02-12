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
  console.log(`${socket.id} is connected`);

  // user setup when login and send active users to client
  socket.on("userSetup", (user) => {
    socket.join(user._id);
    // console.log("active user", user);
    if (!activeUsers.some((user) => user.userId === user._id)) {
      activeUsers.push({ userId: user._id, socketId: socket.id });
    }
    // console.log("activearray", activeUsers);
    io.emit("activeUsers", activeUsers);
  });

  // send message
  socket.on("sendMessage", (data) => {
    const { users } = data;
    if (users.length) {
      users.forEach((user) => {
        socket.in(user._id).emit("recieveMessage", data);
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
    console.log(`${socket.id} is disconnected`);
  });
});

app.use(notFound);
app.use(errorHandler);

server.listen(port, () => {
  console.log(`chat app is running on port ${port}`);
});
