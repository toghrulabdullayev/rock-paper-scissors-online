import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";

import Button from "../ui/Button";
import Input from "../ui/Input";
import { changePassword } from "../util/http";
import { authActions } from "../store/auth";

const ChangePasswordForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate, status } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      navigate("/auth?mode=login");
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  // Migrate to Tanstack Query
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const userData = Object.fromEntries(data.entries());

    mutate(userData);
  };

  return (
    <form
      method="POST"
      onSubmit={handleChangePassword}
      className="flex flex-col items-center w-full max-w-100"
    >
      <Input
        type="password"
        id="password"
        name="password"
        placeholder="New Password"
      />
      <Input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        placeholder="Confirm New Password"
      />
      <Button className="mt-5 w-full" disabled={status === "pending"}>
        {status === "pending" ? "Changing password..." : "Change password"}
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
