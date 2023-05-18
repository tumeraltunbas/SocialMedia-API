import { Router } from "express";
import { getPostOwnerAccess, isAuth } from "../middlewares/auth/auth.js";
import { createPost, updatePost, hidePost, getPostById, getFeed } from "../controllers/post.js";
import { uploader } from "../services/file/upload.service.js";
import { checkPostExists, checkPostBelongsToBlockedUser } from "../middlewares/database/db.query.js";
import likeRoutes from "./like.js";
import commentRoutes from "./comment.js";
import { postQueryMiddleware } from "../middlewares/database/postQueryMiddleware.js";
import savedPostRoutes from "./savedPost.js";

const router = Router();

router.get("/feed", [isAuth, postQueryMiddleware], getFeed);

router.post("/", [isAuth, uploader.single("file")], createPost);
router.put("/:postId", [isAuth, checkPostExists, getPostOwnerAccess], updatePost);
router.put("/:postId/hide", [isAuth, checkPostExists, getPostOwnerAccess], hidePost);
router.get("/:postId", [isAuth, checkPostExists, checkPostBelongsToBlockedUser], getPostById);

//Like routes
router.use("/like/:postId", likeRoutes);
//Comment routes
router.use("/comment/:postId", commentRoutes);
//Save post routes
router.use("/save/:postId", savedPostRoutes);

export default router;