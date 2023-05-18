import { Router } from "express";
import { isAuth, getAdminAccess } from "../middlewares/auth/auth.js";
import { checkPostExists, checkReportExists } from "../middlewares/database/db.query.js";
import { reportPost, getReportsByPostId, getReportById, concludeReport } from "../controllers/report.js";

const router = Router();

router.post("/:postId", [isAuth, checkPostExists], reportPost);
router.get("/post/:postId", [isAuth, getAdminAccess, checkPostExists], getReportsByPostId);
router.get("/:reportId", [isAuth, getAdminAccess, checkReportExists], getReportById);
router.put("/:reportId", [isAuth, getAdminAccess, checkReportExists], concludeReport);

export default router;