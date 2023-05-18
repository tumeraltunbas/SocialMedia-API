import { Router } from "express";
import { isAuth, getAdminAccess } from "../middlewares/auth/auth.js";
import { checkPostExists } from "../middlewares/database/db.query.js";
import { reportPost, getReportsByPostId } from "../controllers/report.js";

const router = Router();

router.post("/:postId", [isAuth, checkPostExists], reportPost);
router.get("/:postId", [isAuth, getAdminAccess, checkPostExists], getReportsByPostId);

export default router;