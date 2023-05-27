import { Router } from "express";
import { isAuth, getMessageOwnerAccess } from "../middlewares/auth/auth.js";
import { checkRoomExists, checkIsRoomMember, checkMessageExists } from "../middlewares/database/db.query.js";
import { getMessagesByRoomId, deleteMessage } from "../controllers/message.js";


const router = Router();

router.get("/:roomId", [isAuth, checkRoomExists, checkIsRoomMember], getMessagesByRoomId);
router.delete("/:roomId/:messageId", [isAuth, checkRoomExists, checkIsRoomMember, checkMessageExists, getMessageOwnerAccess], deleteMessage);

export default router;