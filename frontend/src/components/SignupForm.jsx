import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";

import Button from "../ui/Button";
import Input from "../ui/Input";
import { signup } from "../util/http";
import { authActions } from "../store/auth";

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate, status } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      dispatch(authActions.setIsAuth(true));
      navigate("/online");
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const userData = Object.fromEntries(data.entries());

    mutate(userData);
  };

  return (
    <form
      method="POST"
      onSubmit={handleSignup}
      className="flex flex-col items-center w-full max-w-100"
    >
      <Input type="email" id="email" name="email" placeholder="Email" />
      <Input type="text" id="username" name="username" placeholder="Username" />
      <Input
        type="password"
        id="password"
        name="password"
        placeholder="Password"
      />
      <Input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        placeholder="Confirm Password"
      />
      <Button className="mt-5 w-full" disabled={status === "pending"}>
        {status === "pending" ? "Signing Up..." : "Sign up"}
      </Button>
      <p className="mt-2 text-header-outline">
        Already have an account?{" "}
        <Link to="/auth?mode=login" className="text-white">
          Log in
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
