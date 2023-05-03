import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { createPost, updatePost, hidePost } from "../controllers/post.js";
import upload from "../services/file/upload.service.js";
import { checkPostExists } from "../middlewares/database/db.query.js";

const router = Router();

router.post("/", [isAuth, upload.single("file")], createPost);
router.put("/:postId", [isAuth, checkPostExists], updatePost);
router.put("/:postId/hide", [isAuth, checkPostExists], hidePost);

export default router;