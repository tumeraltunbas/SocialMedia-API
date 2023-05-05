import { Router } from "express";
import { getPostOwnerAccess, isAuth } from "../middlewares/auth/auth.js";
import { createPost, updatePost, hidePost, getPostById, getFeed } from "../controllers/post.js";
import upload from "../services/file/upload.service.js";
import { checkPostExists } from "../middlewares/database/db.query.js";
import likeRoutes from "./like.js";
import commentRoutes from "./comment.js";

const router = Router();

router.get("/feed", isAuth, getFeed);

router.post("/", [isAuth, upload.single("file")], createPost);
router.put("/:postId", [isAuth, checkPostExists, getPostOwnerAccess], updatePost);
router.put("/:postId/hide", [isAuth, checkPostExists, getPostOwnerAccess], hidePost);
router.get("/:postId", [isAuth, checkPostExists], getPostById);

//Like routes
router.use("/like/:postId", likeRoutes);
//Comment routes
router.use("/comment/:postId", commentRoutes);

export default router;