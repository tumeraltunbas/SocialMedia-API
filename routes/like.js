import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { checkPostBelongsToBlockedUser, checkPostBelongsToUser, checkProfileAccess} from "../middlewares/database/db.query.js";
import { likePost, undoLikePost } from "../controllers/like.js";

const router = Router({mergeParams: true});

router.get("/:username/:postId", [isAuth, checkPostBelongsToUser, checkProfileAccess, checkPostBelongsToBlockedUser], likePost);
router.get("/:username/:postId/undo", [isAuth, checkPostBelongsToUser, checkProfileAccess, checkPostBelongsToBlockedUser], undoLikePost);


export default router;