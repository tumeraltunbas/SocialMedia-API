import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { checkPostExists } from "../middlewares/database/db.query.js";
import { likePost, undoLikePost } from "../controllers/like.js";

const router = Router({mergeParams: true});

router.get("/", [isAuth, checkPostExists], likePost);
router.get("/undo", [isAuth, checkPostExists], undoLikePost);

export default router;