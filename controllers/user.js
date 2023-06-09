import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js";
import CustomError from "../services/error/CustomError.js";
import { sendPhoneCodeService } from "../services/sms/sms.service.js";
import { sendEmailVerificationMail, sendMail } from "../services/mail/mail.service.js";
import { capitalize } from "../utils/inputHelpers.js";
import Post from "../models/Post.js";
import Like from "../models/Like.js";
import Follow from "../models/Follow.js";
import Block from "../models/Block.js";
import bcrypt from "bcryptjs";
import SavedPost from "../models/SavedPost.js";
import FollowRequest from "../models/FollowRequest.js";
import Comment from "../models/Comment.js";
import qrcode from "qrcode";
import Report from "../models/Report.js";
import VerifyRequest from "../models/VerifyRequest.js";

export const uploadProfileImage = expressAsyncHandler(async(req, res, next) => {

    const profileImage = req.file;

    if(!profileImage){
        return next(new CustomError(400, "Please provide an image"));
    }

    if(profileImage.mimetype != "image/jpeg" && profileImage.mimetype != "image/png"){

        return next(new CustomError(400, "Profile image must be jpeg or png"));
    }

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: ["id", "profileImageUrl"]
    });

    user.profileImageUrl = profileImage.filename;
    await user.save();

    return res
    .status(200)
    .json({
        success: true,
        message: "Your profile photo has been uploaded"
    });

});

export const removeProfileImage = expressAsyncHandler(async(req, res, next) => {

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: ["id", "profileImage"]
    });

    user.profileImage = "profile.jpg";
    await user.save();

    return res
    .status(200)
    .json({
        success: true,
        message: "Your profile image has been removed"
    });

});

export const updateProfile = expressAsyncHandler(async(req, res, next) => {

    const informations = req.body;

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: [
            "id",
            "username",
            "firstName",
            "lastName",
            "gender",
            "dateOfBirth",
        ]
    });

    if(informations.firstName){

        informations.firstName = capitalize(informations.firstName);
    }

    if(informations.lastName){
        
        informations.lastName = capitalize(informations.lastName);
    }

    await user.update({...informations});

    return res
    .status(200)
    .json({
        success: true,
        message: "Your profile has been updated"
    });

});

export const addPhoneNumber = expressAsyncHandler(async(req, res, next) => {

    const {phoneNumber} = req.body;

    if(!phoneNumber){
        return next(new CustomError(400, "Please provide a phone number"));
    }

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: ["id", "phoneNumber", "phoneCode", "phoneCodeExpires"]
    });

    user.phoneNumber = phoneNumber;
    await sendPhoneCodeService(user);

    return res
    .status(200)
    .json({
        success: true,
        message: "Your phone code has been added"
    });

});

export const changePhoneNumber = expressAsyncHandler(async(req, res, next) => {

    const {phoneNumber} = req.body;

    if(!phoneNumber){
        return next(new CustomError(400, "Please provide a phone number"));
    }

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: [
            "id",
            "phoneNumber",
            "phoneCode",
            "phoneCodeExpires",
            "isPhoneVerified"
        ]
    });

    user.phoneNumber = phoneNumber;
    user.isPhoneVerified = false;

    sendPhoneCodeService(user);
    
    return res
    .status(200)
    .json({
        success: true,
        message: "Your phone number has been updated"
    });

});

export const deletePhoneNumber = expressAsyncHandler(async(req, res, next) => {

    const user = await User.findOne({
        where: {
            id: req.user.id
        }
    });

    if(user.phoneNumber === null){
        return next(new CustomError(400, "You do not already have a phone number"));
    }

    user.phoneNumber = null;
    await user.save();

    return res
    .status(200)
    .json({
        success: true,
        message: "Your phone number has been deleted"
    });

});

export const changeEmail = expressAsyncHandler(async(req, res, next) => {

    const {email} = req.body;

    if(!email){
        return next(new CustomError(400, "Please provide an email"));
    }
    
    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: [
            "id",
            "email",
            "emailVerificationToken",
            "emailVerificationTokenExpires",
            "isEmailVerified"
        ]
    });

    user.email = email;
    user.isEmailVerified = false;

    sendEmailVerificationMail(user);

    return res
    .status(200)
    .json({
        success: true,
        message: "Your email has been changed"
    });

});

export const getLikedPostsByUser = expressAsyncHandler(async(req, res, next) => {

    const {startIndex, limit, pagination} = req.postQuery;
    const {username} = req.params;

    if(req.profileAccess === false){
        return next(new CustomError(403, "You can not access this route because you are not following this user"));
    }

    const user = await User.findOne({
        where: {
            username: username
        }
    });

    const likes = await user.getLikes({
        where: {
            isVisible: true
        },
        attributes: ["id"],
        include: {
            model: Post,
            attributes: [
                "id",
                "content",
                "imageUrl",
                "createdAt"
            ]
        },
        offset: startIndex,
        limit: limit,
        order: [["createdAt", "DESC"]]
    });
    
    return res
    .status(200)
    .json({
        success: true,
        likes:likes,
        count: likes.length,
        pagination: pagination
    });

});

export const getCommentsByUser = expressAsyncHandler(async(req, res, next) => {

    const {username} = req.params;

    if(req.profileAccess === false){
        return next(new CustomError(403, "You can not access this route because you are not following this user"));
    }

    const comments = await Comment.findAll({
        where: {
            isVisible: true
        },
        attributes: { exclude: ["isVisible", "PostId", "UserId"] },
        include: {
            model: User,
            where: { username: username },
            attributes: ["id"]
        },
        order: [["createdAt", "DESC"]]
    });
    
    return res
    .status(200)
    .json({
        success: true,
        comments: comments
    });

});

export const getFollowRequests = expressAsyncHandler(async(req, res, next) => {

    const followRequests = await FollowRequest.findAll({
        where: {
            receiverId: req.user.id,
            isVisible: true
        },
        attributes: ["id"],
        include: {
            model: User,
            as: "sender",
            attributes: [
                "id",
                "username",
                "firstName",
                "lastName",
                "profileImageUrl"
            ]
        }
    });

    return res
    .status(200)
    .json({
        success: true,
        followRequests: followRequests,
        count: followRequests.length
    });

});

export const confirmFollowRequest = expressAsyncHandler(async(req, res, next) => {

    const {followRequestId} = req.params;

    const followRequest = await FollowRequest.findOne({
        where: {
            id: followRequestId
        }
    });

    await Follow.create({
        followerId: followRequest.senderId,
        followingId: followRequest.receiverId
    });

    await followRequest.destroy();

    return res
    .status(200)
    .json({
        success: true,
        message: "Follow request has been accepted"
    });

});

export const followUser = expressAsyncHandler(async(req, res, next) => {

    const {userId} = req.params;

    if(Number(userId) === req.user.id){
        return next(new CustomError(400, "You can not follow yourself"));
    }

    //user to follow
    const user = await User.findOne({
        where: {
            id: userId
        },
        attributes: [
            "id", 
            "isPrivateAccount"
        ]
    });

    //check already following
    const follow = await Follow.findOne({
        where: {
            followerId: req.user.id,
            followingId: user.id
        },
        attributes: ["id"]
    });

    if(follow){
        return next(new CustomError(400, "You are already following this user"));
    }

    if(user.isPrivateAccount === true){
        
        await FollowRequest.findOrCreate({
            where: {
                senderId: req.user.id,
                receiverId: user.id
            }
        });

        return res
        .status(201)
        .json({
            success: true,
            message: "Follow request has been successfully sent"
        });

    }
    else{

        //if user's profile is public, follow.
        await user.addFollower(req.user.id);

        return res
        .status(200)
        .json({
            success: true, 
        });
    
    }

});

export const unfollowUser = expressAsyncHandler(async(req, res, next) => {

    const {userId} = req.params;

    const user = await User.findOne({
        where: {
            id: userId
        },
        attributes: ["id"]
    });

    const follow = await Follow.findOne({
        where: {
            followerId: req.user.id,
            followingId: userId
        },
        attributes: ["id"]
    });

    if(!follow){
        return next(new CustomError(400, "You are not following this user"));
    }

    await user.removeFollower(req.user.id);

    return res
    .status(200)
    .json({
        success: true,
        message: "Unfollow successfull"
    });

});

export const getProfile = expressAsyncHandler(async(req, res, next) => {

    const {username} = req.params;
    
    //Default query
    let user = await User.findOne({
        where: {
            username: username
        },
        attributes: [
            "id",
            "username",
            "firstName",
            "lastName",
            "profileImageUrl",
            "isAccountVerified",
            "createdAt"
        ]
    });

    const followers = await user.getFollowers();
    const following = await user.getFollowing();


    if(req.profileAccess === true){

        //If user follow this user, can see the posts
        await user.reload({

            include: [
                {
                    model: Post,
                    attributes: ["id", "content", "imageUrl"],
                },
            ],
            attributes: [
                "id",
                "username",
                "firstName",
                "lastName",
                "profileImageUrl",
                "createdAt"
            ]

        });

    }

    return res
    .status(200)
    .json({
        success: true,
        user: user,
        followingCount: following.length,
        followersCount: followers.length
    });

});

export const getProfileAsQr = expressAsyncHandler(async(req, res, next) => {

    const {username} = req.params;
    const {DOMAIN} = process.env;

    const url = `${DOMAIN}/api/user/profile/${username}`;
    const qrCode = await qrcode.toDataURL(url);

    return res
    .status(200)
    .json({
        success: true,
        qrCode: qrCode
    });

});

export const getFollowings = expressAsyncHandler(async(req, res, next) => {

    const {startIndex, limit, pagination, where} = req.userQuery;
    const {username} = req.params;

    if(req.profileAccess === false){
        return next(new CustomError(403, "You can not access this route because you are not following this user"));
    }

    const user = await User.findOne({
        where: {
            username: username
        },
        attributes: ["id"]
    });

    const followings = await user.getFollowing({
        where: where,
        attributes: [
            "id",
            "username",
            "firstName",
            "lastName",
            "profileImageUrl"
        ],
        offset: startIndex,
        limit:limit,
        order: [["createdAt", "DESC"]],
    });

    return res
    .status(200)
    .json({
        success: true,
        followings: followings,
        pagination: pagination
    });

});

export const getFollowers = expressAsyncHandler(async(req, res, next) => {

    const {startIndex, limit, pagination, where} = req.userQuery;
    const {username} = req.params;

    if(req.profileAccess === false){
        return next(new CustomError(403, "You can not access this route because you are not following this user"));
    }

    const user = await User.findOne({
        where: {
            username: username
        },
        attributes: ["id"],
    });

    const followers = await user.getFollowers({
        where: where,
        attributes: [
            "id",
            "username",
            "firstName",
            "lastName",
            "profileImageUrl"
        ],
        offset: startIndex,
        limit:limit,
        order: [["createdAt", "DESC"]],
    });

    return res
    .status(200)
    .json({
        success: true,
        followings: followers,
        pagination: pagination
    });

});

export const blockUser = expressAsyncHandler(async(req, res, next) => {

    const {username} = req.params;

    const user = await User.findOne({
        where: {
            username: username
        },
        attributes: ["id"]
    });

    if(user.id === req.user.id){
        return next(new CustomError(400, "You can not block yourself"));
    }
    
    const block = await Block.findOne({
        where: {
            BlockerId: req.user.id,
            BlockedId: user.id
        },
        attributes: ["id"]
    });

    if(block){
        return next(new CustomError(400, "You already blocked this user"));
    }

    //Block user
    await Block.create({
        BlockerId: req.user.id,
        BlockedId: user.id
    });

    //Unfollow each other
    await Follow.destroy({
        where: {
            FollowerId: req.user.id,
            FollowingId: user.id
        }
    });

    await Follow.destroy({
        where: {
            FollowerId: user.id,
            FollowingId: req.user.id
        }
    });

    return res
    .status(200)
    .json({
        success: true,
        message: "User has been blocked"
    });

});

export const unblockUser = expressAsyncHandler(async(req, res, next) => {

    const {username} = req.params;

    const user = await User.findOne({
        where: {
            username: username
        },
        attributes: ["id"]
    });

    if(user.id === req.user.id){
        return next(new CustomError(400, "You can not unblock yourself"));
    }

    const block = await Block.findOne({
        where: {
            BlockerId: req.user.id,
            BlockedId: user.id
        },
    });

    if(!block){
        return next(new CustomError(400, "You already did not block this user"));
    }

    await block.destroy();

    return res
    .status(200)
    .json({
        success: true,
        message: "User has been unblocked"
    });


});

export const getBlocks = expressAsyncHandler(async(req, res, next) => {

    const {startIndex, limit, pagination} = req.userQuery;

    const blocks = await Block.findAll({
        where: {
            BlockerId: req.user.id
        },
        include: {
            model: User,
            attributes: [
                "id",
                "username",
                "firstName",
                "lastName"
            ]
        },
        offset: startIndex,
        limit: limit,
        order: [["createdAt", "DESC"]]
    });

    return res
    .status(200)
    .json({
        success: true,
        blocks: blocks,
        pagination: pagination
    });

});

export const unblockAll = expressAsyncHandler(async(req, res, next) => {

    const {password} = req.body;

    if(!password){
        return next(new CustomError(400, "Please provide a password"));
    }

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: ["id", "password"]
    });

    //Password validation
    if(!bcrypt.compareSync(password, user.password)){
        
        return next(new CustomError(400, "Your password is invalid"));
    }

    await Block.destroy({
        where: {
            BlockerId: req.user.id
        }
    });

    return res
    .status(200)
    .json({
        success: true,
        message: "All blocks have been unblocked"
    });

});

export const getSavedPosts = expressAsyncHandler(async(req, res, next) => {
    
    const savedPosts = await SavedPost.findAll({
        where: {
            UserId: req.user.id,
            isVisible: true
        },
        include: {
            model: Post,
            attributes: [
                "id",
                "content",
                "imageUrl",
                "createdAt"
            ],
            include: {
                model: User,
                attributes: [
                    "id",
                    "firstName",
                    "lastName",
                    "username",
                    "profileImageUrl"
                ]
            }
        },
        order: [["createdAt", "DESC"]]
    });

    return res
    .status(200)
    .json({
        success: true,
        savedPosts: savedPosts
    });

});

export const makeAccountPrivate = expressAsyncHandler(async(req, res, next) => {

    const user = await User.findOne({
        where: {
            id: req.user.id,
            isActive: true
        },
        attributes: [
            "id",
            "isPrivateAccount"
        ]
    });

    if(user.isPrivateAccount === true){
        return next(new CustomError(400, "Your account already private"));
    }

    user.isPrivateAccount = true;
    await user.save();

    return res
    .status(200)
    .json({
        success: true,
        message: "Your account has been converted to a private account"
    });

});

export const makeAccountPublic = expressAsyncHandler(async(req, res, next) => {

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: [
            "id",
            "isPrivateAccount"
        ]
    });

    if(user.isPrivateAccount === false){
        return next(new CustomError(400, "Your account already public"));
    }

    user.isPrivateAccount = false;
    await user.save();

    //Accept all follow requests when a user make public his/her profile
    const followerRequests = await FollowRequest.findAll({
        receiverId: req.user.id
    });

    for (let i = 0; i < followerRequests.length; i++) {

        //accept all follow requests
        await Follow.create({
            followerId: followerRequests[i].senderId,
            followingId: user.id
        });

        //delete follow request
        await followerRequests[i].destroy();
    
    }

    return res
    .status(200)
    .json({
        success: true,
        message: "Your account has been converted to public"
    });

});

export const requestUserData = expressAsyncHandler(async(req, res, next) => {

    const {password} = req.body;
    const {SMTP_USER} = process.env;

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: {
            exclude: [
                "isAdmin",
                "twoFactorSecret",
                "emailVerificationToken",
                "emailVerificationTokenExpires",
                "phoneCode",
                "phoneCodeExpires",
                "resetPasswordToken",
                "resetPasswordTokenExpires",
                "isBlocked",
                "accountFreezeDate",
                "accountFreezeCooldown",
                "isActive"
            ]
        }
    });

    if(!bcrypt.compareSync(password, user.password)){
        return next(new CustomError(400, "Your password is invalid"));
    }

    const userResponse = {...user.toJSON(), password: undefined}; //Password will not return to user

    const posts = await Post.findAll({
        where: {
            UserId: user.id,
            isVisible: true
        },        
        attributes: { 
            exclude: [
                "id",
                "UserId",
                "isHidByUser",
                "isVisible",
            ]
        }
    });

    const reports = await Report.findAll({
        where: {
            UserId: req.user.id,
        },
        attributes: {
            exclude: [
                "id",
                "UserId",
                "PostId"
            ]
        },
        include: {
            model: Post,
            attributes: { 
                exclude: [
                    "id",
                    "UserId",
                    "isHidByUser",
                    "isVisible",
                ]
            }
        }
    });

    const requestedData = {
        user: userResponse,
        posts: posts,
        reports: reports
    };

    const mailOptions = {
        from: SMTP_USER,
        to: user.email,
        subject: "About Your Data Request",
        text: `Dear ${user.firstName} ${user.lastName},\n\nYou have requested your data from our system. Your data is attached below.\n\nBest Regards,\nSocialMedia-API`,
        attachments: [
            {
                filename: `${user.username}_data.json`,
                content: JSON.stringify(requestedData, null, 2)
            }    

        ]
    };

    sendMail(mailOptions);
    
    return res
    .status(200)
    .json({
        success: true,
        message: "Your data has been sent your email address"
    });

});

export const verifyRequest = expressAsyncHandler(async(req, res, next) => {

    //Get user
    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: [
            "id",
            "phoneNumber",
            "isAccountVerified"
        ]
    });

    //Check user's account is already verified
    if(user.isAccountVerified === true){
        return next(new CustomError(400, "Your account is already verified"));
    }

    //Get verify request
    const verifyRequest = await VerifyRequest.findOne({
        where: {
            UserId: req.user.id,
            status: "Pending"
        }
    });

    //Check user has a pending request
    if(verifyRequest){
        return next(new CustomError(400, "You already have a pending request. You cannot submit a new request yet"));
    }

    //Follower and post control so that the user can apply for account verification
    const followers = await Follow.count({
        where: {
            FollowingId: req.user.id
        }
    });

    const posts = await Post.count({
        where: {
            UserId: req.user.id
        }
    });

    if(followers < 10000 || posts <= 0 || !user.phoneNumber){
        return next(new CustomError(400, "You must have for apply account verification:  10k followers, at least one post, add your phone number"));
    }

    //Create verify request
    await VerifyRequest.create({
        UserId: req.user.id
    });

    return res
    .status(201)
    .json({
        success: true,
        message: "Account verification request has been sent our staff. The result will be sent by email within a week"
    });

});
