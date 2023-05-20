import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { checkPostBelongsToBlockedUser, checkPostExists } from "../middlewares/database/db.query.js";
import { savePost, undoSavePost } from "../controllers/savedPost.js";

const router = Router({mergeParams: true});

router.use([isAuth, checkPostExists]);

router.get("/", checkPostBelongsToBlockedUser, savePost);
router.delete("/", undoSavePost);

export default router;