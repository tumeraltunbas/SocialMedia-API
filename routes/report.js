import { Router } from "express";
import { isAuth, getAdminAccess } from "../middlewares/auth/auth.js";
import { checkPostBelongsToBlockedUser, checkPostExists, checkReportExists } from "../middlewares/database/db.query.js";
import { reportPost, getReportsByPostId, getReportById, concludeReport } from "../controllers/report.js";

const router = Router();

router.use(isAuth);

router.post("/:postId", [checkPostExists, checkPostBelongsToBlockedUser], reportPost);
router.get("/post/:postId", [getAdminAccess, checkPostExists], getReportsByPostId);
router.get("/:reportId", [getAdminAccess, checkReportExists], getReportById);
router.put("/:reportId", [getAdminAccess, checkReportExists], concludeReport);

export default router;