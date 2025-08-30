import { io } from "socket.io-client";

export const createSocket = () => {
  // Reuse global socket if it exists (for Vite HMR)
  const socket =
    globalThis.socket || //! Remove in production
    io("http://localhost:3000", {
      withCredentials: true,
      autoConnect: false,
    });

  // Save socket globally for HMR
  if (!globalThis.socket) globalThis.socket = socket; //! Remove in production

  // Remove previous listeners to avoid duplicates after HMR
  socket.removeAllListeners();

  // Re-attach listeners
  socket.on("connect", () => {
    console.log("✅ Connected to server:", socket.id)
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Disconnected from server:", reason);
  });

  return socket;
};

const SOCKET_EVENTS = [
  { eventName: "roomsList", prop: "rooms" },
  { eventName: "isInRoom", prop: "isInRoom" },
  { eventName: "beginGame", prop: "hasBegun" },
  { eventName: "getPlayers", prop: "players" },
  { eventName: "gameOver", prop: "outcome" },
];

export const addSocketListeners = (socket, setStateFunc) => {
  SOCKET_EVENTS.forEach((socketEvent) => {
    console.log(socketEvent, "listener added successfuly");
    socket.on(socketEvent.eventName, (data) => {
      setStateFunc({ prop: socketEvent.prop, data });
    });
  });
};

export const removeSocketListeners = (socket) => {
  SOCKET_EVENTS.forEach((socketEvent) => {
    console.log(socketEvent, "listener removed successfuly");
    socket.off(socketEvent.eventName);
  });
};
