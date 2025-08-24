import { Router } from "express";

import { isAuth } from "../middleware/isAuth.js";
import { online } from "../controllers/online.js";

const router = Router();

router.get("/", isAuth, online);

export default router;
