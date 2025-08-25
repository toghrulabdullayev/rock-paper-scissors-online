import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import Header from "../components/Header";
import { authStatus } from "../util/http";
import { authActions } from "../store/auth";
import { createSocket } from "../util/socket";
import { onlineActions } from "../store/online";

const Root = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Migrate to Tanstack Query
  useLayoutEffect(() => {
    const isAuth = async () => {
      try {
        // await authStatus();

        try {
          // init and set socket to a global state
          const s = createSocket();
          dispatch(onlineActions.setSocket(s));
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
