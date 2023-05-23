import { Router } from "express";
import { isAuth, getCommentOwnerAccess } from "../middlewares/auth/auth.js";
import { getCommentsByPostId, createComment, updateComment, hideComment } from "../controllers/comment.js";
import { checkPostExists, checkCommentExists, checkPostBelongsToUser, checkProfileAccess, checkPostBelongsToBlockedUser} from "../middlewares/database/db.query.js";
import { uploader } from "../services/file/upload.service.js";

const router = Router({mergeParams: true});

router.use(isAuth);

router.post("/:username/:postId", [checkPostBelongsToUser, checkProfileAccess, uploader.single("file"), checkPostBelongsToBlockedUser], createComment);
router.put("/:username/:postId/:commentId", [checkProfileAccess, checkCommentExists, getCommentOwnerAccess, checkPostBelongsToBlockedUser], updateComment);
router.put("/:postId/:commentId/hide", [checkCommentExists, getCommentOwnerAccess], hideComment);
router.get("/:username/:postId", [checkPostExists, checkProfileAccess], getCommentsByPostId);

export default router;