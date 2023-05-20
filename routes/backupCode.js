import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { createBackupCodes, refreshBackupCodes, deleteBackupCodes } from "../controllers/backupCode.js";

const router = Router();

router.use(isAuth),

router.get("/create", createBackupCodes);
router.get("/refresh", refreshBackupCodes);
router.get("/delete", deleteBackupCodes);


export default router;