import { Router } from "express";
import multer from "multer";

import { isAuth } from "../middleware/isAuth.js";
import { settings, updateProfile } from "../controllers/settings.js";

const router = Router();

// setting up multer for storing files in RAM (no need to use multer middleware in app.js)
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/", isAuth, settings);
router.post(
  "/update-profile",
  isAuth,
  // req.body.profileImage is the file
  upload.single("profileImage"),
  updateProfile
);

export default router;
