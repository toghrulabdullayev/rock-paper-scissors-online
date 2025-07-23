import { Router } from "express";

import { isAuth } from "../middleware/isAuth.js";
import { userProfile } from "../controllers/profile.js";

const router = Router();

router.get("/:username", isAuth, userProfile);

export default router;
