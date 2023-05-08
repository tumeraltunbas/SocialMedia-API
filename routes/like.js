import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { checkPostExists, checkPostBelongsToBlockedUser } from "../middlewares/database/db.query.js";
import { likePost, undoLikePost } from "../controllers/like.js";

const router = Router({mergeParams: true});

router.get("/", [isAuth, checkPostExists, checkPostBelongsToBlockedUser], likePost);
router.get("/undo", [isAuth, checkPostExists, checkPostBelongsToBlockedUser], undoLikePost);

export default router;