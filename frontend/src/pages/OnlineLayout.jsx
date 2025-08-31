import { useLayoutEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { useQuery } from "@tanstack/react-query";

import { authStatus } from "../util/http";

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
        await authStatus();
        socket.connect();
      } catch (error) {
        console.log(error);
        navigate("/auth?mode=login", { state: { isAuthChecked: true } });
      }
      setIsCheckingAuth(false);
    };

    isAuth();
  }, [navigate, dispatch]);

  // const { data, status } = useQuery({
  //   queryKey: ["online"],
  //   queryFn: ({ signal }) => online(signal),
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });

  return isCheckingAuth ? <div>Checking Auth</div> : <Outlet />;
};

export default Online;
