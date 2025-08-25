import { Router } from "express";

import {
  authStatus,
  changePassword,
  login,
  logout,
  reset,
  signup,
  verifyOTP,
} from "../controllers/auth.js";
import { isAuth } from "../middleware/isAuth.js";
import { isAlreadyAuth } from "../middleware/isAlreadyAuth.js";

const router = Router();

router.get("/status", isAuth, authStatus);
router.post("/signup", isAlreadyAuth, signup);
router.post("/login", isAlreadyAuth, login);
router.post("/logout", logout);
router.post("/reset", isAlreadyAuth, reset);
router.post("/otp", isAlreadyAuth, verifyOTP);
router.post("/changepassword", isAlreadyAuth, changePassword);

export default router;
