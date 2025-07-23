// import { Suspense } from "react";

// import { useQuery } from "@tanstack/react-query";
// import { Await, useLoaderData } from "react-router-dom";

import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { authStatus } from "../util/http";

// u need tanstack query asap
const Online = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const isAuth = async () => {
      setIsCheckingAuth(true);
      try {
        await authStatus();
      } catch (error) {
        console.log(error);
        navigate("/auth?mode=login", { state: { isAuthChecked: true } });
      }
      setIsCheckingAuth(false);
    };

    isAuth();
  }, [navigate]);

  return isCheckingAuth ? <div>Checking Auth</div> : <h1>Online Page</h1>;
};

export default Online;
