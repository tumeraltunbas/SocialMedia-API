import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { checkPostExists, checkPostBelongsToBlockedUser } from "../middlewares/database/db.query.js";
import { likePost, undoLikePost } from "../controllers/like.js";

const router = Router({mergeParams: true});

router.use([isAuth, checkPostExists, checkPostBelongsToBlockedUser]);

router.get("/", likePost);
router.get("/undo", undoLikePost);

export default router;