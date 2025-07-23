import { useSearchParams } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import ResetForm from "../components/ResetForm";
import OtpForm from "../components/OtpForm";
import ChangePasswordForm from "../components/ChangePasswordForm";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");

  return (
    <div className="mt-12 flex flex-col justify-center items-center">
      {mode === "login" && <LoginForm />}
      {mode === "signup" && <SignupForm />}
      {mode === "reset" && <ResetForm />}
      {mode === "otp" && <OtpForm />}
      {mode === "changepassword" && <ChangePasswordForm />}
    </div>
  );
};

export default AuthPage;
