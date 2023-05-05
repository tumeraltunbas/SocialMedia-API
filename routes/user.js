import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import upload from "../services/file/upload.service.js";
import { uploadProfileImage, updateProfile, addPhoneNumber, changePhoneNumber, changeEmail, getLikedPosts } from "../controllers/user.js";
import followRoutes from "./follow.js";

const router = Router();


router.post("/profile/image", [isAuth, upload.single("file")], uploadProfileImage);
router.put("/profile/update", isAuth, updateProfile);
router.post("/phone/add", isAuth, addPhoneNumber);
router.put("/phone/change", isAuth, changePhoneNumber);
router.put("/email/change", isAuth, changeEmail);
router.get("/likes", isAuth, getLikedPosts);

router.use("/follow", isAuth, followRoutes);

export default router;