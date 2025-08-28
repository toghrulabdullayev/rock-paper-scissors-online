import { Router } from "express";

import { isAuth } from "../middleware/isAuth.js";
import { myProfile, userProfile } from "../controllers/profile.js";

const router = Router();

router.get("/", isAuth, myProfile);
router.get("/:username", isAuth, userProfile);

export default router;
