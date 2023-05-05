import { Router } from "express";
import { isAuth, getCommentOwnerAccess } from "../middlewares/auth/auth.js";
import { createComment, updateComment } from "../controllers/comment.js";
import { checkPostExists, checkCommentExists } from "../middlewares/database/db.query.js";
import upload from "../services/file/upload.service.js";

const router = Router({mergeParams: true});

router.post("/", [isAuth, checkPostExists, upload.single("file")], createComment);
router.put("/:commentId", [isAuth, checkCommentExists, getCommentOwnerAccess], updateComment);

export default router;