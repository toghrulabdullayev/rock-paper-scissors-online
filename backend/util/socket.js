import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import crypto from "node:crypto";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    pingInterval: 2000,
    pingTimeout: 5000,
  },
});

let userId = 1;

// socket.id associated with userId ({socketId: userId}) ✅
const users = {};

// {roomId, users: [{userId, score}]} ✅
const rooms = [];

// ez
const wins = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

//* you can send request from the backend to the same backend
io.use(async (socket, next) => {
  try {
    const response = await fetch("http://localhost:3000/api/v1/auth/status", {
      headers: {
        // in backend, you should type this instead of credentials: "include"
        cookie: socket.handshake.headers.cookie || "",
      },
    });

    if (!response.ok) {
      console.log("Unauthorized socket connection attempt:", socket.id);
      return next(new Error("Unauthorized"));
    }

    const data = await response.json();

    socket.user = data.user; // attach authenticated user info to socket
    next();
  } catch (err) {
    console.log("Socket auth error:", err);
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // get rooms list whenever connected
  const availableRooms = rooms.filter((room) => room.users.length < 2);
  io.emit("roomsList", availableRooms);

  // binding socket.id with userId (imitating userId)
  users[socket.id] = userId;
  userId += 1;
  console.log("Users:", users);

  // sending a msg
  socket.on("hello", (arg) => {
    if (isUserInRoom(socket)) {
      const roomId = [...socket.rooms][1];
      // if in room, send msg to the room
      io.to(roomId).emit("hello", arg);
    } else {
      // if not in room - only to himself
      socket.emit("hello", arg);
    }
    // rooms of the userId - set {} (1st room - socket.id (private room); 2nd room - custom roomId)
    console.log("Rooms of the", users[socket.id], socket.rooms);
  });

  socket.on("joinRoom", () => {
    if (canJoinRoom(socket)) {
      // 12 character roomId
      const roomId = crypto.randomBytes(6).toString("hex");

      socket.join(roomId);
      console.log("Joined the room:", roomId);

      // updating list of rooms
      rooms.push({
        roomId,
        users: [{ userId: users[socket.id], score: 0, gesture: null }],
      });
      const availableRooms = rooms.filter((room) => room.users.length < 2);
      io.emit("roomsList", availableRooms);

      // for leave button in frontend
      socket.emit("isInRoom", true);
    }
  });

  socket.on("joinRoomById", (roomId) => {
    if (
      canJoinRoom(socket) &&
      !isEqualToSocketId(socket, roomId) &&
      !isRoomFull(roomId) &&
      isRoomExists(roomId) &&
      isValidRoomId(roomId)
    ) {
      socket.join(roomId);

      // adding user data to a room (userId and score)
      addUserDataToRoom(socket, roomId);
      console.log(rooms[findRoomIndex(roomId)]);

      // whether to show leave button in frontend or not
      socket.emit("isInRoom", true);

      // filtering full rooms
      const availableRooms = rooms.filter((room) => room.users.length < 2);
      io.emit("roomsList", availableRooms);
      // io.to(roomId).emit("getPlayers", rooms[findRoomIndex(roomId)].users);
      //! cibiti code 1.0
      // io.to(roomId).emit("getPlayers", getOrderedPlayers(roomId, socket));
      //! cibiti code 2.0
      sendPlayersOrdered(roomId);

      io.to(roomId).emit("beginGame", isRoomFull(roomId));
    }
  });

  socket.on("playGesture", (gesture) => {
    const roomId = [...socket.rooms][1];
    const room = rooms[findRoomIndex(roomId)];

    const player = room.users.find((user) => user.userId === users[socket.id]);
    const opponent = room.users.find(
      (user) => user.userId !== users[socket.id]
    );

    player.gesture = gesture;
    console.log(room);

    let isGestureNull = room.users.some((user) => !user.gesture);

    if (!isGestureNull) {
      console.log("Player:", player);
      console.log("Opponent:", opponent);

      console.log("ROUND");
      if (player.gesture === opponent.gesture) {
        console.log("tie");
      } else if (wins[player.gesture] === opponent.gesture) {
        console.log(player.userId, "won");
        player.score += 1;
      } else if (wins[player.gesture] !== opponent.gesture) {
        console.log(opponent.userId, "won");
        opponent.score += 1;
      }

      player.gesture = null;
      opponent.gesture = null;
      sendPlayersOrdered(roomId);

      if (player.score >= 5 || opponent.score >= 5) {
        // similar strategy as the sendPlayersOrdered function below
        for (const roomPlayer of room.users) {
          const socketId = Object.keys(users).find(
            (id) => users[id] === roomPlayer.userId
          );
          if (!socketId) continue;

          // long story
          let outcome;
          if (player.score > opponent.score) {
            if (player.userId === users[socketId]) {
              outcome = "You won!";
            } else if (opponent.userId === users[socketId]) {
              outcome = "You lost!";
            }
          } else {
            if (player.userId === users[socketId]) {
              outcome = "You lost!";
            } else if (opponent.userId === users[socketId]) {
              outcome = "You won!";
            }
          }

          io.to(socketId).emit("gameOver", outcome);
        }
      }
    }
  });

  socket.on("leaveRoom", () => {
    const roomId = [...socket.rooms][1];
    if (!isEqualToSocketId(socket, roomId)) {
      // Set can't be accessed via indexing
      removeUserFromRoom(socket, roomId);
      socket.leave(roomId);

      console.log(rooms[findRoomIndex(roomId)]);

      // whether to show leave button in frontend or not
      socket.emit("isInRoom", false);

      // filtering full rooms
      const availableRooms = rooms.filter((room) => room.users.length < 2);
      io.emit("roomsList", availableRooms);
    }
  });

  socket.on("disconnect", () => {
    if (isUserInRoom(socket)) {
      const roomId = [...socket.rooms][1];
      removeUserFromRoom(socket, roomId);
    }

    console.log("User disconnected:", socket.id);
    delete users[socket.id];

    socket.emit("isInRoom", false);

    const availableRooms = rooms.filter((room) => room.users.length < 2);
    io.emit("roomsList", availableRooms);
  });
});

const isEqualToSocketId = (socket, roomId) => {
  // no need to explain further
  return socket.id === roomId;
};

const canJoinRoom = (socket) => {
  // if socket.rooms set contains only socket.id as a single element
  return socket.rooms.size < 2;
};

const isUserInRoom = (socket) => {
  // if socket.rooms contains socket.id and a custom room as only 2 elements
  return socket.rooms.size === 2;
};

const addUserDataToRoom = (socket, roomId) => {
  // chaos
  rooms[findRoomIndex(roomId)].users.push({
    userId: users[socket.id],
    score: 2,
    gesture: null,
  });
};

const isRoomExists = (roomId) => {
  return findRoomIndex(roomId) !== -1;
};

const isValidRoomId = (roomId) => {
  return (
    roomId.length === 12 &&
    typeof roomId === "string" &&
    roomId.toLowerCase() === roomId
  );
};

const isRoomFull = (roomId) => {
  return rooms[findRoomIndex(roomId)].users.length >= 2;
};

// roomId = [...socket.rooms][1]
const removeUserFromRoom = (socket, roomId) => {
  rooms[findRoomIndex(roomId)].users = rooms[
    findRoomIndex(roomId)
  ].users.filter((user) => user.userId !== users[socket.id]);
};

const findRoomIndex = (roomId) => {
  return rooms.findIndex((room) => room.roomId === roomId);
};

//! cibiti code 2.0
const sendPlayersOrdered = (roomId) => {
  const room = rooms[findRoomIndex(roomId)];
  if (!room) return;

  for (const player of room.users) {
    const socketId = Object.keys(users).find(
      (id) => users[id] === player.userId
    );
    if (!socketId) continue;

    const ordered = [...room.users];
    if (ordered[0].userId !== player.userId) {
      ordered.reverse();
    }

    io.to(socketId).emit("getPlayers", ordered);
  }
};

export { app, server, io };
