import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import crypto from "node:crypto";

//* Disconnect the socket code
// export const disconnectUser = (userId) => {
//   const sockets = userSockets.get(userId);
//   if (!sockets) return;

//   for (const socketId of sockets) {
//     const s = io.sockets.sockets.get(socketId);
//     s?.disconnect(true); // force disconnect
//   }

//   userSockets.delete(userId);
// };

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

// socket.id associated with userId ({socketId: userId}) ✅
// const users = {};
const userSocketMap = {};
const socketUserMap = {};

// {roomId, score, users: [{userId, score, gesture}]} ✅
const rooms = [];

// ez
const wins = {
  rock: ["lizard", "scissors"],
  scissors: ["paper", "lizard"],
  lizard: ["spock", "paper"],
  paper: ["rock", "spock"],
  spock: ["scissors", "rock"],
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
  // socket.use((packet, next) => {
  //   // The packet is an array: [eventName, ...args]
  //   const eventName = packet[0];

  //   if (/* GPT, LOOK HERE, HOW TO CHECK FOR AUTH */true) {
  //     console.log(
  //       `Dropping unauthorized event: ${eventName} from ${socket.id}`
  //     );
  //     // Do not call next(), which discards the event and prevents it from reaching your listeners
  //     return;
  //   }

  //   next();
  // });

  console.log("Socket user:", socket.user);
  console.log("A user connected:", socket.id);
  socket.joinedRoom = null;

  const userId = socket.user._id;

  // get rooms list whenever connected
  const availableRooms = rooms.filter((room) => room.users.length < 2);
  io.emit("roomsList", availableRooms);

  // binding socket.id with userId (imitating userId)
  userSocketMap[userId] = socket.id;
  socketUserMap[socket.id] = userId;
  console.log("Users:", userSocketMap);

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
    console.log("Rooms of the", socketUserMap[socket.id], socket.rooms);
  });

  socket.on("joinRoom", (score) => {
    if (canJoinRoom(socket)) {
      // 12 character roomId
      const roomId = crypto.randomBytes(6).toString("hex");

      socket.join(roomId);
      socket.joinedRoom = roomId;
      console.log("Joined the room:", roomId);

      // updating list of rooms
      rooms.push({
        roomId,
        score,
        users: [
          {
            userId: socket.user._id,
            username: socket.user.username,
            score: 0,
            gesture: null,
          },
        ],
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
      socket.joinedRoom = roomId;

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

    const player = room.users.find((user) => user.userId === socket.user._id);
    if (player.gesture) {
      return;
    }
    const opponent = room.users.find((user) => user.userId !== socket.user._id);

    console.log("Player", player);

    player.gesture = gesture;
    console.log("room", room);

    let isGestureNull = room.users.some((user) => !user.gesture);

    if (!isGestureNull) {
      console.log("Player:", player);
      console.log("Opponent:", opponent);

      console.log("ROUND");
      sendPlayersOrdered(roomId);

      // delayed effect
      setTimeout(() => {
        sendPlayersOrdered(roomId);
      }, 2500);

      if (player.gesture === opponent.gesture) {
        console.log("tie");
      } else if (wins[player.gesture].includes(opponent.gesture)) {
        console.log(player.userId, "won");
        player.score += 1;
      } else if (!wins[player.gesture].includes(opponent.gesture)) {
        console.log(opponent.userId, "won");
        opponent.score += 1;
      }

      if (player.score >= room.score || opponent.score >= room.score) {
        // similar strategy as the sendPlayersOrdered function below
        for (const roomPlayer of room.users) {
          const socketId = Object.keys(socketUserMap).find(
            (id) => socketUserMap[id] === roomPlayer.userId
          );
          if (!socketId) continue;

          // long story
          let outcome;
          if (player.score > opponent.score) {
            if (player.userId === socketUserMap[socketId]) {
              outcome = "You won!";
            } else if (opponent.userId === socketUserMap[socketId]) {
              outcome = "You lost!";
            }
          } else {
            if (player.userId === socketUserMap[socketId]) {
              outcome = "You lost!";
            } else if (opponent.userId === socketUserMap[socketId]) {
              outcome = "You won!";
            }
          }

          io.to(socketId).emit("gameOver", outcome);
        }
      }

      // nextRound
      setTimeout(() => {
        player.gesture = null;
        opponent.gesture = null;
        sendPlayersOrdered(roomId);
        io.to(roomId).emit("nextRound");
      }, 5000);
    }
  });

  socket.on("leaveRoom", () => {
    const roomId = [...socket.rooms][1];
    if (!isEqualToSocketId(socket, roomId)) {
      // Set can't be accessed via indexing
      removeUserFromRoom(socket, roomId);
      socket.leave(roomId);
      socket.joinedRoom = null;

      console.log(rooms[findRoomIndex(roomId)]);

      // whether to show leave button in frontend or not
      socket.emit("isInRoom", false);

      // filtering full rooms
      const availableRooms = rooms.filter((room) => room.users.length < 2);
      io.emit("roomsList", availableRooms);
    }
  });

  socket.on("disconnect", () => {
    console.log(socket.joinedRoom);
    if (isUserInRoom(socket)) {
      const roomId = socket.joinedRoom;
      if (!isRoomFull(roomId)) {
        console.log("Disconnected from the room!");
        removeUserFromRoom(socket, roomId);
        console.log(rooms[findRoomIndex(roomId)]);
      }
    }

    console.log("User disconnected:", socket.id);
    delete socketUserMap[socket.id];

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
  // return socket.rooms.size === 2;
  return !!socket.joinedRoom;
};

const addUserDataToRoom = (socket, roomId) => {
  // chaos
  rooms[findRoomIndex(roomId)].users.push({
    userId: socket.user._id,
    username: socket.user.username,
    score: 0,
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
  ].users.filter((user) => user.userId !== socketUserMap[socket.id]);
};

const findRoomIndex = (roomId) => {
  return rooms.findIndex((room) => room.roomId === roomId);
};

//! cibiti code 2.0
const sendPlayersOrdered = (roomId) => {
  const room = rooms[findRoomIndex(roomId)];
  if (!room) return;

  for (const player of room.users) {
    const socketId = Object.keys(socketUserMap).find(
      (id) => socketUserMap[id] === player.userId
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
