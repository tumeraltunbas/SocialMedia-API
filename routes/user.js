import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import upload from "../services/file/upload.service.js";
import { uploadProfileImage, removeProfileImage, updateProfile, addPhoneNumber, changePhoneNumber, changeEmail, getLikedPosts, followUser, unfollowUser, getProfile, getFollowings, getFollowers, blockUser, unblockUser, getBlocks, unblockAll } from "../controllers/user.js";
import { checkUserExists, checkUserFollowing, checkUserBlocked } from "../middlewares/database/db.query.js";

const router = Router();

router.post("/profile/image", [isAuth, upload.single("file")], uploadProfileImage);
router.put("/profile/image/remove", isAuth, removeProfileImage);
router.put("/profile/update", isAuth, updateProfile);
router.post("/phone/add", isAuth, addPhoneNumber);
router.put("/phone/change", isAuth, changePhoneNumber);
router.put("/email/change", isAuth, changeEmail);
router.get("/likes", isAuth, getLikedPosts);
router.get("/follow/:userId", [isAuth, checkUserExists, checkUserBlocked], followUser);
router.get("/unfollow/:userId", [isAuth, checkUserExists, checkUserBlocked], unfollowUser);
router.get("/profile/:username", [isAuth, checkUserExists, checkUserBlocked], getProfile);
router.get("/profile/:username/followings", [isAuth, checkUserExists, checkUserFollowing], getFollowings);
router.get("/profile/:username/followers", [isAuth, checkUserExists, checkUserFollowing], getFollowers);
router.get("/profile/:username/block", [isAuth, checkUserExists], blockUser);
router.get("/profile/:username/unblock", [isAuth, checkUserExists], unblockUser);
router.get("/blocks", isAuth, getBlocks);
router.post("/unblock/all", isAuth, unblockAll);

export default router;