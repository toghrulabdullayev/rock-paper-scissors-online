import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";

import { authStatus, /* online */ } from "../util/http";
import RoomsList from "../components/RoomsList";
import { createSocket } from "../util/socket";

// u need tanstack query asap
const Online = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const isAuth = async () => {
      setIsCheckingAuth(true);
      try {
        await authStatus();
        const s = createSocket();
        setSocket(s);
      } catch (error) {
        console.log(error);
        navigate("/auth?mode=login", { state: { isAuthChecked: true } });
      }
      setIsCheckingAuth(false);
    };

    isAuth();

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [navigate]);

  // const { data, status } = useQuery({
  //   queryKey: ["online"],
  //   queryFn: ({ signal }) => online(signal),
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });

  return (
    <div className="mt-16 flex flex-col justify-between items-center h-fit bg-red-500">
      {isCheckingAuth ? <div>Checking Auth</div> : <RoomsList />}
    </div>
  );
};

export default Online;
