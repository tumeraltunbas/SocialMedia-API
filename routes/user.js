import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import {imageUploader} from "../services/file/upload.service.js";
import { uploadProfileImage, removeProfileImage, updateProfile, addPhoneNumber, changePhoneNumber, deletePhoneNumber, changeEmail, getLikedPosts, followUser, unfollowUser, getProfile, getFollowings, getFollowers, blockUser, unblockUser, getBlocks, unblockAll, getSavedPosts, makeAccountPrivate } from "../controllers/user.js";
import { checkUserExists, checkUserFollowing, checkUserBlocked } from "../middlewares/database/db.query.js";
import { postQueryMiddleware } from "../middlewares/database/postQueryMiddleware.js";
import { userQueryMiddleware } from "../middlewares/database/userQueryMiddleware.js";

const router = Router();

router.post("/profile/image", [isAuth, imageUploader.single("file")], uploadProfileImage);
router.put("/profile/image/remove", isAuth, removeProfileImage);
router.put("/profile/update", isAuth, updateProfile);
router.post("/phone/add", isAuth, addPhoneNumber);
router.put("/phone/change", isAuth, changePhoneNumber);
router.put("/phone/delete", isAuth, deletePhoneNumber);
router.put("/email/change", isAuth, changeEmail);
router.get("/likes", [isAuth, postQueryMiddleware], getLikedPosts);
router.get("/follow/:userId", [isAuth, checkUserExists, checkUserBlocked], followUser);
router.get("/unfollow/:userId", [isAuth, checkUserExists, checkUserBlocked], unfollowUser);
router.get("/profile/:username", [isAuth, checkUserExists, checkUserBlocked], getProfile);
router.get("/profile/:username/followings", [isAuth, checkUserExists, checkUserFollowing, userQueryMiddleware], getFollowings);
router.get("/profile/:username/followers", [isAuth, checkUserExists, checkUserFollowing,userQueryMiddleware], getFollowers);
router.get("/profile/:username/block", [isAuth, checkUserExists], blockUser);
router.get("/profile/:username/unblock", [isAuth, checkUserExists], unblockUser);
router.get("/blocks", [isAuth, userQueryMiddleware], getBlocks);
router.post("/unblock/all", isAuth, unblockAll);
router.get("/posts/saved", isAuth, getSavedPosts);
router.get("/privacy/private", isAuth, makeAccountPrivate);


export default router;