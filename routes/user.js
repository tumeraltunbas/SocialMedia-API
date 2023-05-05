import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import upload from "../services/file/upload.service.js";
import { uploadProfileImage, updateProfile, addPhoneNumber, changePhoneNumber, changeEmail, getLikedPosts, followUser } from "../controllers/user.js";
import { checkUserExists } from "../middlewares/database/db.query.js";

const router = Router();


router.post("/profile/image", [isAuth, upload.single("file")], uploadProfileImage);
router.put("/profile/update", isAuth, updateProfile);
router.post("/phone/add", isAuth, addPhoneNumber);
router.put("/phone/change", isAuth, changePhoneNumber);
router.put("/email/change", isAuth, changeEmail);
router.get("/likes", isAuth, getLikedPosts);
router.get("/follow/:userId", [isAuth, checkUserExists], followUser);

export default router;