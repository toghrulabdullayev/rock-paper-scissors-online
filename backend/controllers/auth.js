import bcrypt from "bcryptjs";
import { Resend } from "resend";

import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyResetToken,
} from "../util/token.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const authStatus = (_, res) => {
  res.status(200).json({ message: "User authorized successfully" });
};

export const signup = async (req, res, next) => {
  const { email, username, password, confirmPassword } = req.body;

  try {
    if (!email || !username || !password || !confirmPassword) {
      throw {
        status: 400,
        message: "All fields are required",
      };
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      throw {
        status: 409,
        message: "User already exists",
      };
    }

    if (password !== confirmPassword) {
      throw {
        status: 401,
        message: "Passwords do not match",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    console.log(newUser);

    const jwtPayload = {
      _id: newUser._id,
      email: newUser.email,
      username: newUser.username,
    };

    const accessToken = generateAccessToken(jwtPayload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    const refreshToken = generateRefreshToken(jwtPayload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    // const { data, error } = await resend.emails.send({
    //   from: "myEmail",
    //   to: email,
    //   subject: "Hello World",
    //   html: "<strong>It works!</strong>",
    // });

    // if (error) {
    //   return console.error({ error });
    // }

    // console.log({ data });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password, isRemember } = req.body;

  try {
    if (!email || !password) {
      throw {
        status: 400,
        message: "All fields are required",
      };
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw {
        status: 404,
        message: "User does not exist",
      };
    }

    const doMatch = await bcrypt.compare(password, user.password);

    if (!doMatch) {
      throw {
        status: 401,
        message: "Incorrect credentials",
      };
    }

    const jwtPayload = {
      _id: user._id,
      email: user.email,
      username: user.username,
    };

    const accessToken = generateAccessToken(jwtPayload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    const refreshToken = generateRefreshToken(jwtPayload, isRemember);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const logout = async (_, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "User logged out successfully" });
};

export const reset = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      throw {
        status: 400,
        message: "All fields are required",
      };
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw {
        status: 404,
        message: "User does not exist",
      };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = await bcrypt.hash(otp, 12);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.expiresAt = expiresAt;
    user.isVerified = false;

    // to assure who requested a password reset
    const resetToken = generateResetToken(email);

    await user.save();

    res.cookie("resetToken", resetToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_EMAIL_ADDRESS,
      to: email,
      subject: "Reset Password",
      html: `<strong>${otp}</strong>`,
    });

    if (error) {
      return console.error({ error });
    }

    console.log({ data });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  const { otp } = req.body;

  try {
    if (!otp) {
      throw {
        status: 400,
        message: "All fields are required",
      };
    }

    const { email } = verifyResetToken(req.cookies.resetToken);

    const user = await User.findOne({ email });

    if (!user) {
      throw {
        status: 404,
        message: "User does not exist",
      };
    }

    if (!user.otp) {
      throw {
        status: 404,
        message: "OTP does not exist",
      };
    }

    if (Date.now() >= user.expiresAt.getTime()) {
      throw {
        status: 410,
        message: "OTP is expired",
      };
    }

    if (user.isVerified) {
      throw {
        status: 409,
        message: "OTP is already verified",
      };
    }

    const doMatch = await bcrypt.compare(otp, user.otp);

    if (!doMatch) {
      throw {
        status: 409,
        message: "Invalid OTP",
      };
    }

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "Otp verified successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  try {
    if (!password || !confirmPassword) {
      throw {
        status: 400,
        message: "All fields are required",
      };
    }

    const { email } = verifyResetToken(req.cookies.resetToken);

    const user = await User.findOne({ email });

    if (!user) {
      throw {
        status: 409,
        message: "User does not exist",
      };
    }

    if (!user.otp) {
      throw {
        status: 404,
        message: "OTP does not exist",
      };
    }

    if (!user.isVerified) {
      throw {
        status: 401,
        message: "OTP is not verified",
      };
    }

    if (password !== confirmPassword) {
      throw {
        status: 401,
        message: "Passwords do not match",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    user.otp = null;
    user.expiresAt = null;
    user.isVerified = false;
    await user.save();

    res.clearCookie("resetToken");

    return res.status(201).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
