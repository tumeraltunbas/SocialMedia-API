import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { followUser } from "../controllers/follow.js";
import { checkUserExists } from "../middlewares/database/db.query.js";

const router = Router({mergeParams: true});

router.use(isAuth);

router.get("/:userId", checkUserExists, followUser);


export default router;