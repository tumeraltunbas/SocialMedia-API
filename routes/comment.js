import { Router } from "express";
import { isAuth, getCommentOwnerAccess } from "../middlewares/auth/auth.js";
import { getCommentsByPostId, createComment, updateComment, hideComment } from "../controllers/comment.js";
import { checkPostExists, checkCommentExists, checkPostBelongsToBlockedUser } from "../middlewares/database/db.query.js";
import { uploader } from "../services/file/upload.service.js";

const router = Router({mergeParams: true});

router.get("/", [isAuth, checkPostExists], getCommentsByPostId);
router.post("/", [isAuth, checkPostExists, checkPostBelongsToBlockedUser, uploader.single("file")], createComment);
router.put("/:commentId", [isAuth, checkCommentExists, getCommentOwnerAccess], updateComment);
router.put("/:commentId/hide", [isAuth, checkCommentExists, getCommentOwnerAccess], hideComment);

export default router;