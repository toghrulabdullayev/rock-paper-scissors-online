import { useLayoutEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { useQuery } from "@tanstack/react-query";

import { authStatus /* online */ } from "../util/http";
import { addSocketListeners, removeSocketListeners } from "../util/socket";
import { onlineActions } from "../store/online";

// u need tanstack query asap
const Online = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { socket } = useSelector((state) => state.online);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const isAuth = async () => {
      setIsCheckingAuth(true);
      try {
        // await authStatus();

        // add socket listeners if the socket is initialized
        if (socket) {
          addSocketListeners(socket, (data) =>
            dispatch(onlineActions.setStateProp(data))
          );
        }
      } catch (error) {
        console.log(error);
        navigate("/auth?mode=login", { state: { isAuthChecked: true } });
      }
      setIsCheckingAuth(false);
    };

    isAuth();

    return () => {
      if (socket) {
        removeSocketListeners(socket);
      }
    };
  }, [navigate, socket, dispatch]);

  // const { data, status } = useQuery({
  //   queryKey: ["online"],
  //   queryFn: ({ signal }) => online(signal),
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });

  return (
    <div className="mt-16 flex flex-col justify-between items-center h-fit">
      {isCheckingAuth ? <div>Checking Auth</div> : <Outlet />}
    </div>
  );
};

export default Online;
