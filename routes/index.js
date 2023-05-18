import { Router } from "express";
import authRoutes from "./auth.js";
import backupRoutes from "./backupCode.js";
import userRoutes from "./user.js";
import postRoutes from "./post.js";
import adminRoutes from "./admin.js";
import reportRoutes from "../routes/report.js"

const router = Router();

router.use("/auth", authRoutes);
router.use("/backup", backupRoutes);
router.use("/user", userRoutes);
router.use("/post", postRoutes);
router.use("/admin", adminRoutes);
router.use("/report", reportRoutes);

export default router;