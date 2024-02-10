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
  socket.on("userSetup", (data) => {
    console.log("active user", data);
    if (!activeUsers.some((user) => user.userId === data._id)) {
      activeUsers.push({ userId: data._id, socketId: socket.id });
    }

    io.emit("activeUsers", activeUsers);
  });

  // send message
  socket.on("sendMessage", (data) => {
    const { recieverId } = data;

    const user = activeUsers.find((user) => user.userId === recieverId);
    // console.log("sending to ", user);
    // console.log("data: ", data);
    if (user) {
      io.to(user.socketId).emit("recieveMessage", data);
    }
  });

  // typing status
  socket.on("typingStatus", (data) => {
    console.log(data);
    io.emit("typing", data);

    setTimeout(() => {
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
