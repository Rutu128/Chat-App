const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173" });

let onlineUser = [];

io.on("connection", (socket) => {
  //   console.log("New Connection", socket.id);

  //listen for new connections

  socket.on("addNewUser", (userId) => {
    !onlineUser.some((user) => userId === user._id) &&
      onlineUser.push({
        userId,
        socketId: socket.id,
      });
  });

  io.emit("getOnlineUsers", onlineUser);
  //   console.log(onlineUser);

  //add message

  socket.on("sendMessage", (message) => {
    const user = onlineUser.find(user => user.userId === message.recipientId)
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
    }
  })

  socket.on("disconnect", () => {
    onlineUser = onlineUser.filter((user) => user.socketId!== socket.id);
    io.emit("getOnlineUsers", onlineUser);
    console.log("User disconnected", socket.id);
  })
});

io.listen(3000);
