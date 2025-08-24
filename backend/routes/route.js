import { Router } from "express";

import { isAuth } from "../middleware/isAuth.js";

import authRoutes from "./auth.js";
import onlineRoutes from "./online.js";
import profileRoutes from "./profile.js";
import settingsRoutes from "./settings.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/online", isAuth, onlineRoutes);
router.use("/profile", isAuth, profileRoutes);
router.use("/settings", isAuth, settingsRoutes);

export default router;
