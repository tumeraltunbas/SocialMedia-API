import { Router } from "express";
import { signUp, signIn } from "../controllers/auth.js";
import { checkUserExists } from "../middlewares/database/db.query.js";

const router = Router();

router.post("/sign/up", signUp);
router.post("/sign/in", checkUserExists, signIn);


export default router;