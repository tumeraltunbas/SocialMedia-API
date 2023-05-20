import { Router } from "express";
import { isAuth, getCommentOwnerAccess } from "../middlewares/auth/auth.js";
import { getCommentsByPostId, createComment, updateComment, hideComment } from "../controllers/comment.js";
import { checkPostExists, checkCommentExists, checkPostBelongsToBlockedUser, checkPostBelongsToUser, checkUserFollowing} from "../middlewares/database/db.query.js";
import { uploader } from "../services/file/upload.service.js";

const router = Router({mergeParams: true});

router.use(isAuth);

router.post("/:username/:postId", [checkPostBelongsToUser, checkUserFollowing, uploader.single("file")], createComment);
router.put("/:username/:postId/:commentId", [checkPostBelongsToBlockedUser, checkUserFollowing, checkCommentExists, getCommentOwnerAccess], updateComment);
router.put("/:postId/:commentId/hide", [checkCommentExists, getCommentOwnerAccess], hideComment);
router.get("/:username/:postId", [checkPostExists, checkUserFollowing], getCommentsByPostId);

export default router;