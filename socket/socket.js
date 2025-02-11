import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: process.env.REACT_URL_PUBLIC,
  },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
    onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
}

const getUser = (userId) => {
    return onlineUser.find((user) => user.userId === userId);
}

io.on("connection", (socket) => {
  socket.on("add:user-online", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("add:message", ({ receiverId, message }) => {
    const receiver = getUser(receiverId);

    io.to(receiver.socketId).emit("get:message", message);
  })

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen(3001, () => {
  console.log("Socket is running");
});
