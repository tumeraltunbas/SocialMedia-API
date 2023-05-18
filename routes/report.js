import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { checkPostExists } from "../middlewares/database/db.query.js";
import { reportPost } from "../controllers/report.js";

const router = Router({mergeParams: true});

router.post("/", [isAuth, checkPostExists], reportPost);

export default router;