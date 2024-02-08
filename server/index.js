const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoutes");
const dotenv = require("dotenv");
const { notFound, errorHandler } = require("./middlewares/errorMiddlewares");
dotenv.config();
connectDB();

const app = express();
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

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`chat app is running on port ${port}`);
});
