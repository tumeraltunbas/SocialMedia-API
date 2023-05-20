import { Router } from "express";
import { isAuth, getCommentOwnerAccess } from "../middlewares/auth/auth.js";
import { getCommentsByPostId, createComment, updateComment, hideComment } from "../controllers/comment.js";
import { checkPostExists, checkCommentExists, checkPostBelongsToBlockedUser } from "../middlewares/database/db.query.js";
import { uploader } from "../services/file/upload.service.js";

const router = Router({mergeParams: true});

router.use(isAuth);

router.get("/", checkPostExists, getCommentsByPostId);
router.post("/", [checkPostExists, checkPostBelongsToBlockedUser, uploader.single("file")], createComment);
router.put("/:commentId", [checkCommentExists, getCommentOwnerAccess], updateComment);
router.put("/:commentId/hide", [checkCommentExists, getCommentOwnerAccess], hideComment);

export default router;