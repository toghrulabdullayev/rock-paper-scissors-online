import { useEffect } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { authActions } from "../store/authSlice"; // adjust to your slice

let socket = null;

const useSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:3000", {
        withCredentials: true,
        autoConnect: false,
      });
    }

    // Clean old listeners to avoid duplication
    socket.removeAllListeners();

    // Attach listeners
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected:", reason);
    });

    socket.on("roomsList", (rooms) => {
      dispatch(authActions.setRooms(rooms));
    });

    socket.on("isInRoom", (isUserInRoom) => {
      dispatch(authActions.setIsInRoom(isUserInRoom));
    });

    socket.on("beginGame", (isRoomFull) => {
      dispatch(authActions.setHasBegun(isRoomFull));
    });

    socket.on("getPlayers", (players) => {
      dispatch(authActions.setUsers(players));
    });

    socket.on("gameOver", (state) => {
      dispatch(authActions.setResults(state));
    });

    return () => {
      socket?.removeAllListeners();
    };
  }, [dispatch]);

  return socket;
};

export default useSocket;
