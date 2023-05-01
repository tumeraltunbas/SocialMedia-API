import { Router } from "express";
import { signUp, signIn, verifyEmail, sendEmail } from "../controllers/auth.js";
import { checkUserExists } from "../middlewares/database/db.query.js";

const router = Router();

router.post("/sign/up", signUp);
router.post("/sign/in", checkUserExists, signIn);
router.get("/email/verify", verifyEmail);
router.post("/email/send", checkUserExists, sendEmail);


export default router;