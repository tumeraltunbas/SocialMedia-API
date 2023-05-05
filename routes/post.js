import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { createPost, updatePost, hidePost, getPostById } from "../controllers/post.js";
import upload from "../services/file/upload.service.js";
import { checkPostExists } from "../middlewares/database/db.query.js";
import likeRoutes from "./like.js";
import commentRoutes from "./comment.js";

const router = Router();

router.post("/", [isAuth, upload.single("file")], createPost);
router.put("/:postId", [isAuth, checkPostExists], updatePost);
router.put("/:postId/hide", [isAuth, checkPostExists], hidePost);
router.get("/:postId", [isAuth, checkPostExists], getPostById);

//Like
router.use("/like/:postId", likeRoutes);
//Comment
router.use("/comment/:postId", commentRoutes);

export default router;