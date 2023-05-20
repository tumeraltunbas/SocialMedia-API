import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { checkPostBelongsToUser, checkUserFollowing} from "../middlewares/database/db.query.js";
import { likePost, undoLikePost } from "../controllers/like.js";

const router = Router({mergeParams: true});

router.get("/:username/:postId", [isAuth, checkPostBelongsToUser, checkUserFollowing], likePost);


export default router;