import { Router } from "express";
import authRoutes from "./auth.js";
import backupRoutes from "./backupCode.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/backup", backupRoutes);

export default router;