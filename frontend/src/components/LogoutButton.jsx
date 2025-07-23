import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { authActions } from "../store/auth";
import { logout } from "../util/http";
import { useQueryClient } from "@tanstack/react-query";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await logout();
    dispatch(authActions.setIsAuth(false));
    queryClient.removeQueries();
    navigate("/auth?mode=login");
  };

  return (
    <button
      className="text-left w-full block px-4 py-2 text-lg text-red-500 cursor-pointer"
      onClick={handleLogout}
    >
      Log out
    </button>
  );
};

export default LogoutButton;
