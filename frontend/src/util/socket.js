import { io } from "socket.io-client";

let socket;

export const createSocket = () => {
  // Only create socket if it doesn't exist or is disconnected
  if (!socket) {
    socket = io("http://localhost:3000", {
      withCredentials: true,
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from server:", reason);
    });

    socket.on("roomsList", (rooms) => {
      console.log("Rooms received:", rooms);
    });
  }

  return socket;
};
