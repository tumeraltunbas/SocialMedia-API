import { Router } from "express";
import authRoutes from "./auth.js";
import backupRoutes from "./backupCode.js";
import userRoutes from "./user.js";
import postRoutes from "./post.js";
import adminRoutes from "./admin.js";
import reportRoutes from "../routes/report.js"
import likeRoutes from "../routes/like.js";
import commentRoutes from "../routes/comment.js";
import savePostRoutes from "../routes/savedPost.js";
import messageRoutes from "./message.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/backup", backupRoutes);
router.use("/user", userRoutes);
router.use("/post", postRoutes);
router.use("/admin", adminRoutes);
router.use("/report", reportRoutes);
router.use("/like", likeRoutes);
router.use("/comment", commentRoutes);
router.use("/save", savePostRoutes);
router.use("/message", messageRoutes);


export default router;