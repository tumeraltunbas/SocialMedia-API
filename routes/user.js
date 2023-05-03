import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import upload from "../services/file/upload.service.js";
import { uploadProfileImage, updateProfile } from "../controllers/user.js";

const router = Router();


router.post("/profile/image", [isAuth, upload.single("file")], uploadProfileImage);
router.put("/profile/update", isAuth, updateProfile);

export default router;