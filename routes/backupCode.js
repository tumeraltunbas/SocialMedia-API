import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { createBackupCodes } from "../controllers/backupCode.js";

const router = Router();

router.get("/create", isAuth, createBackupCodes);


export default router;