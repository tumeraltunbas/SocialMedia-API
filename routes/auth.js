import { Router } from "express";
import { signUp, signIn, verifyEmail, sendEmail, changePassword, forgotPassword } from "../controllers/auth.js";
import { checkUserExists } from "../middlewares/database/db.query.js";
import { isAuth } from "../middlewares/auth/auth.js";

const router = Router();

router.post("/sign/up", signUp);
router.post("/sign/in", checkUserExists, signIn);
router.get("/email/verify", verifyEmail);
router.post("/email/send", checkUserExists, sendEmail);
router.put("/password/change", isAuth, changePassword);
router.post("/password/forgot", checkUserExists, forgotPassword);


export default router;