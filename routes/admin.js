import { Router } from "express";
import { getAdminAccess, isAuth } from "../middlewares/auth/auth.js";
import { userQueryMiddleware } from "../middlewares/database/userQueryMiddleware.js";
import { getAllUsers } from "../controllers/admin.js";

const router = Router();

router.get("/users", [isAuth, getAdminAccess, userQueryMiddleware], getAllUsers);


export default router;