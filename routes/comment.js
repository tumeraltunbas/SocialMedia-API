import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { createComment } from "../controllers/comment.js";
import { checkPostExists } from "../middlewares/database/db.query.js";
import upload from "../services/file/upload.service.js";

const router = Router({mergeParams: true});

router.post("/", [isAuth, checkPostExists, upload.single("file")], createComment);

export default router;