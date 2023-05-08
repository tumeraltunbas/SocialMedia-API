import { Router } from "express";
import { getAdminAccess, isAuth } from "../middlewares/auth/auth.js";
import { userQueryMiddleware } from "../middlewares/database/userQueryMiddleware.js";
import { getAllUsers, getAllPosts } from "../controllers/admin.js";
import { postQueryMiddleware } from "../middlewares/database/postQueryMiddleware.js";

const router = Router();

router.get("/users", [isAuth, getAdminAccess, userQueryMiddleware], getAllUsers);
router.get("/posts", [isAuth, getAdminAccess, postQueryMiddleware], getAllPosts);


export default router;