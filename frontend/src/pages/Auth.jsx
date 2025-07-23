import { useLayoutEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { authStatus } from "../util/http";

function AuthLayout() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (location.state?.isAuthChecked) {
      setIsCheckingAuth(false);
      return;
    }

    const isAuth = async () => {
      setIsCheckingAuth(true);
      try {
        await authStatus();
        navigate("/online");
      } catch (error) {
        console.log(error);
      }
      setIsCheckingAuth(false);
    };

    isAuth();
  }, [location.pathname, navigate]);

  return isCheckingAuth ? <div>Checking Auth</div> : <Outlet />;
}

export default AuthLayout;
