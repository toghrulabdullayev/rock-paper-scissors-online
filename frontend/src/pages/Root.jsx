import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import Header from "../components/Header";
import { authStatus } from "../util/http";
import { authActions } from "../store/auth";

const Root = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Migrate to Tanstack Query
  useLayoutEffect(() => {
    const isAuth = async () => {
      try {
        await authStatus();
        dispatch(authActions.setIsAuth(true));
      } catch (error) {
        console.log(error);
      }
    };

    isAuth();
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
