import { Router } from "express";
import { isAuth, getAdminAccess } from "../middlewares/auth/auth.js";
import { checkPostExists, checkReportExists } from "../middlewares/database/db.query.js";
import { reportPost, getReportsByPostId, getReportById } from "../controllers/report.js";

const router = Router();

router.post("/:postId", [isAuth, checkPostExists], reportPost);
router.get("/post/:postId", [isAuth, getAdminAccess, checkPostExists], getReportsByPostId);
router.get("/:reportId", [isAuth, getAdminAccess, checkReportExists], getReportById);

export default router;