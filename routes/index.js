import { Router } from "express";
import authRoutes from "./auth.js";
import backupRoutes from "./backupCode.js";
import userRoutes from "./user.js";
import postRoutes from "./post.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/backup", backupRoutes);
router.use("/user", userRoutes);
router.use("/post", postRoutes);

export default router;