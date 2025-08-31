import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (user, isRemember = false) => {
  return jwt.sign({ user }, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: isRemember ? "90d" : "1d",
  });
};

export const decodeRefreshToken = (token) => {
  return jwt.decode(token, process.env.JWT_REFRESH_TOKEN_SECRET);
};

export const generateResetToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_RESET_TOKEN_SECRET, {
    expiresIn: "10m",
  });
};

export const verifyResetToken = (token) => {
  return jwt.verify(token, process.env.JWT_RESET_TOKEN_SECRET);
};
