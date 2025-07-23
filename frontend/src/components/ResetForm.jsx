import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";

import Button from "../ui/Button";
import Input from "../ui/Input";
import { reset } from "../util/http";
import { authActions } from "../store/auth";

const ResetForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate, status } = useMutation({
    mutationFn: reset,
    onSuccess: () => {
      console.log("Good");
      navigate("/auth?mode=otp");
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const handleReset = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const userData = Object.fromEntries(data.entries());

    mutate(userData);
  };

  return (
    <form
      method="POST"
      onSubmit={handleReset}
      className="flex flex-col items-center w-full max-w-100"
    >
      <Input type="email" id="email" name="email" placeholder="Email" />
      <Button className="mt-5 w-full" disabled={status === "pending"}>
        {status === "pending" ? "Resetting..." : "Reset"}
      </Button>
    </form>
  );
};

export default ResetForm;
