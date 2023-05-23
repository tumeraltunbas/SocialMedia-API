import { Router } from "express";
import { getAdminAccess, isAuth } from "../middlewares/auth/auth.js";
import { userQueryMiddleware } from "../middlewares/database/userQueryMiddleware.js";
import { getAllUsers, getAllPosts, getUserById, blockUserByAdmin, unblockUserByAdmin, assignAdminRole, undoAdminRole, getAllVerifyRequests, getVerifyRequestById } from "../controllers/admin.js";
import { postQueryMiddleware } from "../middlewares/database/postQueryMiddleware.js";
import { checkUserExists, checkVerifyRequestExists } from "../middlewares/database/db.query.js"

const router = Router();

router.use([isAuth, getAdminAccess]);

router.get("/users", userQueryMiddleware, getAllUsers);
router.get("/posts", postQueryMiddleware, getAllPosts);
router.get("/user/:userId", checkUserExists, getUserById);
router.get("/:userId/block", checkUserExists, blockUserByAdmin);
router.get("/:userId/unblock", checkUserExists, unblockUserByAdmin);
router.get("/:userId/assign", checkUserExists, assignAdminRole);
router.get("/:userId/undo", checkUserExists, undoAdminRole);
router.get("/verify/requests", getAllVerifyRequests);
router.get("/verify/request/:verifyRequestId", checkVerifyRequestExists, getVerifyRequestById);

export default router;