import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";

import Button from "../ui/Button";
import Input from "../ui/Input";
import CheckBox from "../ui/Checkbox";
import { login } from "../util/http";
import { authActions } from "../store/auth";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate, status } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      dispatch(authActions.setIsAuth(true));
      navigate("/online");
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const userData = Object.fromEntries(data.entries());

    mutate(userData);
  };

  return (
    <form
      method="POST"
      onSubmit={handleLogin}
      className="flex flex-col items-center w-full max-w-100"
    >
      <Input type="email" id="email" name="email" placeholder="Email" />
      <Input
        type="password"
        id="password"
        name="password"
        placeholder="Password"
      />
      <div className="mt-5 flex items-center justify-between w-full">
        <CheckBox />
        <Link to="/auth?mode=reset" className="text-white">
          Forgot Password?
        </Link>
      </div>
      <Button className="mt-5 w-full" disabled={status === "pending"}>
        {status === "pending" ? "Logging in..." : "Log in"}
      </Button>
      <p className="mt-2 text-header-outline">
        Don&apos;t have an account yet?{" "}
        <Link to="/auth?mode=signup" className="text-white">
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
