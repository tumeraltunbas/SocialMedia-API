import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import upload from "../services/file/upload.service.js";
import { uploadProfileImage, updateProfile, addPhoneNumber, changePhoneNumber } from "../controllers/user.js";

const router = Router();


router.post("/profile/image", [isAuth, upload.single("file")], uploadProfileImage);
router.put("/profile/update", isAuth, updateProfile);
router.post("/phone/add", isAuth, addPhoneNumber);
router.put("/phone/change", isAuth, changePhoneNumber);

export default router;