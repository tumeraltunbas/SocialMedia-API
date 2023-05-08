import { Router } from "express";
import { getAdminAccess, isAuth } from "../middlewares/auth/auth.js";
import { userQueryMiddleware } from "../middlewares/database/userQueryMiddleware.js";
import { getAllUsers, getAllPosts, blockUserByAdmin, unblockUserByAdmin } from "../controllers/admin.js";
import { postQueryMiddleware } from "../middlewares/database/postQueryMiddleware.js";
import { checkUserExists } from "../middlewares/database/db.query.js"

const router = Router();

router.use([isAuth, getAdminAccess]);

router.get("/users", userQueryMiddleware, getAllUsers);
router.get("/posts", postQueryMiddleware, getAllPosts);
router.get("/:userId/block", checkUserExists, blockUserByAdmin);
router.get("/:userId/unblock", checkUserExists, unblockUserByAdmin);

export default router;