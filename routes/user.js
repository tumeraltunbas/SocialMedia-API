import { Router } from "express";
import { isAuth } from "../middlewares/auth/auth.js";
import {imageUploader} from "../services/file/upload.service.js";
import { uploadProfileImage, removeProfileImage, updateProfile, addPhoneNumber, changePhoneNumber, deletePhoneNumber, changeEmail, getLikedPosts,getFollowRequests, confirmFollowRequest, followUser, unfollowUser, getProfile, getFollowings, getFollowers, blockUser, unblockUser, getBlocks, unblockAll, getSavedPosts, makeAccountPrivate, makeAccountPublic} from "../controllers/user.js";
import { checkUserExists, checkUserFollowing, checkUserBlocked, checkFollowRequestExists } from "../middlewares/database/db.query.js";
import { postQueryMiddleware } from "../middlewares/database/postQueryMiddleware.js";
import { userQueryMiddleware } from "../middlewares/database/userQueryMiddleware.js";

const router = Router();

router.use(isAuth);

router.post("/profile/image", imageUploader.single("file"), uploadProfileImage);
router.put("/profile/image/remove", removeProfileImage);
router.put("/profile/update", updateProfile);
router.post("/phone/add", addPhoneNumber);
router.put("/phone/change", changePhoneNumber);
router.put("/phone/delete", deletePhoneNumber);
router.put("/email/change", changeEmail);
router.get("/likes", postQueryMiddleware, getLikedPosts);
router.get("/follow/requests", getFollowRequests);
router.get("/follow/requests/:followRequestId/confirm", checkFollowRequestExists, confirmFollowRequest);
router.get("/follow/:userId", [checkUserExists, checkUserBlocked], followUser);
router.get("/unfollow/:userId", [checkUserExists, checkUserBlocked], unfollowUser);
router.get("/profile/:username", [checkUserExists, checkUserBlocked, checkUserFollowing], getProfile);
router.get("/profile/:username/followings", [checkUserExists, checkUserFollowing, userQueryMiddleware], getFollowings);
router.get("/profile/:username/followers", [checkUserExists, checkUserFollowing, userQueryMiddleware], getFollowers);
router.get("/profile/:username/block", [checkUserExists], blockUser);
router.get("/profile/:username/unblock", [checkUserExists], unblockUser);
router.get("/blocks", userQueryMiddleware, getBlocks);
router.post("/unblock/all", unblockAll);
router.get("/posts/saved", getSavedPosts);
router.get("/privacy/private", makeAccountPrivate);
router.get("/privacy/public", makeAccountPublic);


export default router;