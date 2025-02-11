import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.route.js";
import postRouter from "./routes/post.route.js";
import userRouter from "./routes/user.route.js";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/message.route.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({ origin: process.env.PUBLIC_FRONTEND_URL, credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api", postRouter);
app.use("/api", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);

app.listen(port, () => {
    console.log("Server is running!");
})