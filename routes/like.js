import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { checkPostBelongsToUser, checkProfileAccess} from "../middlewares/database/db.query.js";
import { likePost, undoLikePost } from "../controllers/like.js";

const router = Router({mergeParams: true});

router.get("/:username/:postId", [isAuth, checkPostBelongsToUser, checkProfileAccess], likePost);
router.get("/:username/:postId/undo", [isAuth, checkPostBelongsToUser, checkProfileAccess], undoLikePost);


export default router;