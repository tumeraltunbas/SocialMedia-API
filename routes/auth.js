import { Router } from "express";
import { signUp, signIn, logout, verifyEmail, sendEmail, changePassword, forgotPassword, resetPassword, enable2FA } from "../controllers/auth.js";
import { checkUserExists } from "../middlewares/database/db.query.js";
import { isAuth } from "../middlewares/auth/auth.js";

const router = Router();

router.post("/sign/up", signUp);
router.post("/sign/in", checkUserExists, signIn);
router.get("/logout", isAuth, logout);
router.get("/email/verify", verifyEmail);
router.post("/email/send", checkUserExists, sendEmail);
router.put("/password/change", isAuth, changePassword);
router.post("/password/forgot", checkUserExists, forgotPassword);
router.put("/password/reset", resetPassword);
router.get("/2fa/enable", isAuth, enable2FA); 

export default router;