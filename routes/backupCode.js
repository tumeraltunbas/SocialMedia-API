import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { createBackupCodes, refreshBackupCodes, deleteBackupCodes } from "../controllers/backupCode.js";

const router = Router();

router.get("/create", isAuth, createBackupCodes);
router.get("/refresh", isAuth, refreshBackupCodes);
router.get("/delete", isAuth, deleteBackupCodes);


export default router;