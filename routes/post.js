import { Router } from "express";
import { getPostOwnerAccess, isAuth } from "../middlewares/auth/auth.js";
import { createPost, updatePost, hidePost, getPostById, getFeed } from "../controllers/post.js";
import { uploader } from "../services/file/upload.service.js";
import { checkPostExists, checkPostBelongsToBlockedUser, checkUserFollowing } from "../middlewares/database/db.query.js";
import { postQueryMiddleware } from "../middlewares/database/postQueryMiddleware.js";

const router = Router();

router.get("/feed", [isAuth, postQueryMiddleware], getFeed);

router.post("/", [isAuth, uploader.single("file")], createPost);
router.put("/:postId", [isAuth, checkPostExists, getPostOwnerAccess], updatePost);
router.put("/:postId/hide", [isAuth, checkPostExists, getPostOwnerAccess], hidePost);
router.get("/:username/:postId", [isAuth, checkPostExists, checkUserFollowing], getPostById);

export default router;