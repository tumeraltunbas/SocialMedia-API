import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { checkPostExists } from "../middlewares/database/db.query.js";
import { likePost } from "../controllers/like.js";

const router = Router({mergeParams: true});

router.get("/", [isAuth, checkPostExists], likePost);


export default router;