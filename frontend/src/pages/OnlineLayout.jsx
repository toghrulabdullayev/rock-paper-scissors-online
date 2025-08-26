import { useLayoutEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { useQuery } from "@tanstack/react-query";

import { authStatus /* online */ } from "../util/http";

// u need tanstack query asap
const Online = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const isAuth = async () => {
      setIsCheckingAuth(true);
      try {
        // await authStatus();
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

  return (
    // <div className="mt-16 flex flex-col justify-between items-center h-fit bg-cyan-500">
    isCheckingAuth ? <div>Checking Auth</div> : <Outlet />
    // </div>
  );
};

export default Online;
