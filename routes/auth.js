import { Router } from "express";
import { signUp, signIn, verifyEmail } from "../controllers/auth.js";
import { checkUserExists } from "../middlewares/database/db.query.js";

const router = Router();

router.post("/sign/up", signUp);
router.post("/sign/in", checkUserExists, signIn);
router.get("/email/verify", verifyEmail);


export default router;