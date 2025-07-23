import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";

import Button from "../ui/Button";
import Input from "../ui/Input";
import { verifyOtp } from "../util/http";
import { authActions } from "../store/auth";

const OtpForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate, status } = useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      navigate("/auth?mode=changepassword");
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  // Migrate to Tanstack Query
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const userData = Object.fromEntries(data.entries());

    mutate(userData);
  };

  return (
    <form
      method="POST"
      onSubmit={handleVerifyOtp}
      className="flex flex-col items-center w-full max-w-100"
    >
      <Input type="text" id="otp" name="otp" placeholder="6-Digit OTP" />
      <Button className="mt-5 w-full" disabled={status === "pending"}>
        {status === "pending" ? "Verifying OTP..." : "Verify OTP"}
      </Button>
    </form>
  );
};

export default OtpForm;
