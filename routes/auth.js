import { Router } from "express";
import { signUp } from "../controllers/auth.js";

const router = Router();

router.post("/sign/up", signUp);


export default router;