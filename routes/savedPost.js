import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { checkPostBelongsToUser, checkUserFollowing } from "../middlewares/database/db.query.js";
import { savePost, undoSavePost } from "../controllers/savedPost.js";

const router = Router({mergeParams: true});

router.use(isAuth);

router.get("/:username/:postId", [checkPostBelongsToUser, checkUserFollowing], savePost);
router.delete("/:username/:postId", checkPostBelongsToUser, undoSavePost);

export default router;