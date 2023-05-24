import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { checkPostBelongsToBlockedUser, checkPostBelongsToUser, checkProfileAccess} from "../middlewares/database/db.query.js";
import { likePost, undoLikePost, getLikesByPostId } from "../controllers/like.js";

const router = Router({mergeParams: true});

router.use(isAuth);

router.get("/:username/:postId", [checkPostBelongsToUser, checkProfileAccess, checkPostBelongsToBlockedUser], likePost);
router.get("/:username/:postId/undo", [checkPostBelongsToUser, checkProfileAccess, checkPostBelongsToBlockedUser], undoLikePost);
router.get("/:username/:postId/likes", [checkPostBelongsToUser, checkProfileAccess, checkPostBelongsToBlockedUser], getLikesByPostId);

export default router;