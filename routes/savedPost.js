import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { checkPostBelongsToBlockedUser, checkPostExists } from "../middlewares/database/db.query.js";
import { savePost, undoSavePost } from "../controllers/savedPost.js";

const router = Router({mergeParams: true});

router.get("/", [isAuth, checkPostExists, checkPostBelongsToBlockedUser], savePost);
router.delete("/", [isAuth, checkPostExists], undoSavePost);

export default router;