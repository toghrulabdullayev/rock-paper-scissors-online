import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Header from "../components/Header";
import { authStatus } from "../util/http";
import { authActions } from "../store/auth";
import {
  createSocket,
  addSocketListeners,
  removeSocketListeners,
} from "../util/socket";
import { onlineActions } from "../store/online";

const Root = () => {
  const { socket } = useSelector((state) => state.online);
  const location = useLocation();
  const dispatch = useDispatch();

  // Migrate to Tanstack Query
  useLayoutEffect(() => {
    const isAuth = async () => {
      try {
        // await authStatus();
        // add socket listeners if the socket is initialized
        try {
          // init and set socket to a global state
          const s = createSocket();
          dispatch(onlineActions.setSocket(s));
          addSocketListeners(s, (data) =>
            dispatch(onlineActions.setStateProp(data))
          );
        } catch (error) {
          console.log("Socket error");
          console.error(error);
        }

        dispatch(authActions.setIsAuth(true));
      } catch (error) {
        console.log(error);
      }
    };

    isAuth();

    return () => {
      if (socket) {
        removeSocketListeners(socket);
      }

      dispatch(onlineActions.setSocket(null));
    };
  }, [dispatch]);

  return (
    <>
      <Header
        inGame={
          location.pathname === "/cpu" || location.pathname === "/lobbyid"
        }
      />
      <main className="w-[90vw]">
        <Outlet />
      </main>
    </>
  );
};

export default Root;
