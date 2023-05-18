import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js";
import CustomError from "../services/error/CustomError.js";
import { sendPhoneCodeService } from "../services/sms/sms.service.js";
import { sendEmailVerificationMail } from "../services/mail/mail.service.js";
import { capitalize } from "../utils/inputHelpers.js";
import Post from "../models/Post.js";
import Like from "../models/Like.js";
import Follow from "../models/Follow.js";
import Block from "../models/Block.js";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";

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

export const getLikedPosts = expressAsyncHandler(async(req, res, next) => {

    const {startIndex, limit, pagination} = req.postQuery;

    const posts = await Post.findAll({
        where: { 
            isVisible: true 
        },
        include: {
            model: Like,
            where: { 
                UserId: req.user.id 
            },
            attributes: [],
        },
        attributes: { exclude: ["isVisible"] },
        offset: startIndex,
        limit: limit,
        order: [[{model: Like}, "createdAt", "DESC"]]
    });

    return res
    .status(200)
    .json({
        success: true,
        posts: posts,
        count: posts.length,
        pagination: pagination
    });

});

export const followUser = expressAsyncHandler(async(req, res, next) => {

    const {userId} = req.params;

    if(Number(userId) === req.user.id){
        return next(new CustomError(400, "You can not follow yourself"));
    }

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

    if(follow){
        return next(new CustomError(400, "You are already following this user"));
    }

    await user.addFollower(req.user.id);

    return res
    .status(200)
    .json({
        success: true, 
    });

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

    const user = await User.findOne({
        where: {
            username: username
        },
        include: [
            {
                model: Post,
                where: { isvisible: true },
                attributes: ["id", "content", "imageUrl"],
            },
            {
                model: Like,
                where: { isVisible: true },
                include: Post
            },
        ],
        attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "gender",
            "dateOfBirth",
            "phoneNumber",
            "profileImageUrl",
            "createdAt"
        ]
    });
    
    const followers = await user.getFollowers();
    const following = await user.getFollowing();

    return res
    .status(200)
    .json({
        success: true,
        user: user,
        userPosts: user.Posts,
        userLikedPosts: user.Likes,
        followingCount: following.length,
        followersCount: followers.length
    });

});

export const getFollowings = expressAsyncHandler(async(req, res, next) => {

    const {username} = req.params;

    const user = await User.findOne({
        where: {
            username: username
        },
        attributes: ["id"]
    });

    const followings = await user.getFollowing({
        attributes: [
            "id",
            "username",
            "firstName",
            "lastName",
            "profileImageUrl"
        ]
    });

    return res
    .status(200)
    .json({
        success: true,
        followings: followings
    });

});

export const getFollowers = expressAsyncHandler(async(req, res, next) => {

    const {username} = req.params;

    const user = await User.findOne({
        where: {
            username: username
        },
        attributes: ["id"]
    });

    const followers = await user.getFollowers({
        attributes: [
            "id",
            "username",
            "firstName",
            "lastName",
            "profileImageUrl"
        ]
    });

    return res
    .status(200)
    .json({
        success: true,
        followings: followers
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
    
    await user.addBlocked(req.user.id);

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

    const blocks = await Block.findAll({
        where: {
            BlockedId: req.user.id
        },
        include: {
            model: User,
            attributes: [
                "id",
                "firstName",
                "lastName"
            ]
        }
    });

    return res
    .status(200)
    .json({
        success: true,
        blocks: blocks
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