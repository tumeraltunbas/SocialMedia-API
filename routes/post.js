import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { createPost } from "../controllers/post.js";
import upload from "../services/file/upload.service.js";

const router = Router();

router.post("/", [isAuth, upload.single("file")], createPost);

export default router;