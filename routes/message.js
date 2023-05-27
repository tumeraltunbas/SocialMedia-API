import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import { checkRoomExists, checkIsRoomMember } from "../middlewares/database/db.query.js";
import { getMessagesByRoomId } from "../controllers/message.js";


const router = Router();

router.get("/:roomId", [isAuth, checkRoomExists, checkIsRoomMember], getMessagesByRoomId);

export default router;