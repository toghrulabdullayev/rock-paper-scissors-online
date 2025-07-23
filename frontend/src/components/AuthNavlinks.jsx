import { NavLink, useSearchParams } from "react-router-dom";

const AuthNavlinks = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");

  return (
    <>
      <NavLink
        to="/auth?mode=login"
        className={() =>
          mode === "login" ? "text-white" : "text-header-outline"
        }
      >
        Log in
      </NavLink>
      <NavLink
        to="/auth?mode=signup"
        className={() =>
          mode === "signup" ? "text-white" : "text-header-outline"
        }
      >
        Sign up
      </NavLink>
    </>
  );
};

export default AuthNavlinks;
