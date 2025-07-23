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

const router = Router();

router.get("/status", isAuth, authStatus);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/reset", reset);
router.post("/otp", verifyOTP);
router.post("/changepassword", changePassword);

export default router;
