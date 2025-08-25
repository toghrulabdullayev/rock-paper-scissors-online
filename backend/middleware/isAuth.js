import jwt from "jsonwebtoken";
import { generateAccessToken } from "../util/token.js";

export const isAuth = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  try {
    if (!accessToken || !refreshToken) {
      throw {
        status: 403,
        message: "User not authorized",
      };
    }

    try {
      const accessDecoded = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_TOKEN_SECRET
      );

      console.log("Access Passed!");
      req.user = accessDecoded.user;
      return next();
    } catch (accessErr) {
      console.log("Access Failed!");
      try {
        const refreshDecoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_TOKEN_SECRET
        );

        console.log("Refresh Passed!");
        const newAccessToken = generateAccessToken(refreshDecoded.user);
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
          path: "/",
        });

        req.user = refreshDecoded.user;
        return next();
      } catch (refreshErr) {
        console.log("Refresh Failed!");
        // clearing tokens when session is expired
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return next({
          status: 403,
          message: "Verification failed",
        });
      }
    }
  } catch (error) {
    console.log(error);
    // clearing cookies if something goes wrong
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    next(error);
  }
};
