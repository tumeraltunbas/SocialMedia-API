import expressAsyncHandler from "express-async-handler";
import User from "../../models/User.js";
import CustomError from "../../services/error/CustomError.js";
import { Op } from "sequelize";
import Post from "../../models/Post.js";
import Follow from "../../models/Follow.js";
import Comment from "../../models/Comment.js";
import Block from "../../models/Block.js";
import Report from "../../models/Report.js";
import FollowRequest from "../../models/FollowRequest.js";
import VerifyRequest from "../../models/VerifyRequest.js";
import Room from "../../models/Room.js";

export const checkUserExists = expressAsyncHandler(async(req, res, next) => {

    const key = req.body.username || req.body.email || req.params.userId || req.params.username;

    const user = await User.findOne({
        where: {
            [Op.or]: [
                {username: key},
                {email: key},
                {id: key}
            ]
        },
        attributes: ["id"]
    });

    if(!user){
        return next(new CustomError(404, "User not found"));
    }

    next();

});

export const checkPostExists = expressAsyncHandler(async(req, res, next) => {

    const {postId} = req.params;

    const post = await Post.findOne({
        where: {
            id: postId,
            isVisible: true
        },
        attributes: ["id"]
    });

    if(!post){
        return next(new CustomError(404, "Post not found"));
    }

    next();

});

export const checkProfileAccess = expressAsyncHandler(async(req, res, next) => {

    const {username} = req.params;

    const user = await User.findOne({
        where: {
            username: username
        },
        attributes: ["id", "isPrivateAccount"]
    });

    req.profileAccess = true;

    if(user.isPrivateAccount === false){ // means public account
        return next();
    }

    if(user.id === req.user.id){
        return next();
    }

    const follow = await Follow.findOne({
        where: {
            FollowerId: req.user.id,
            FollowingId: user.id
        },
        attributes: ["id"]
    });

    if(follow){
        return next();
    }
    else{
        req.profileAccess = false;
    }

    next();

});

export const checkCommentExists = expressAsyncHandler(async(req, res, next) => {

    const {commentId} = req.params;
    const {postId} = req.params;

    const comment = await Comment.findOne({
        where: {
            id: commentId,
            PostId: postId,
            isVisible:  true
        },
        attributes: ["id"]
    });

    if(!comment){
        return next(new CustomError(404), "Comment not found");
    }

    next();

});

export const checkUserBlocked = expressAsyncHandler(async(req, res, next) => {

    const key = req.params.username || req.params.userId;

    const user = await User.findOne({
        where: {
            [Op.or]: [
                { id: key },
                { username: key }
            ]
        },
        attributes: ["id"]
    });

    const block = await Block.findOne({
        where: {
            [Op.or]: [
                {
                    BlockerId: req.user.id,
                    BlockedId: user.id
                },
                {
                    BlockerId: user.id,
                    BlockedId: req.user.id,
                }
            ]

        },
        attributes: ["id"]
    });

    if(block){
        return next(new CustomError(400, "You can not access this route due to block"));
    }

    next();
    
});

export const checkPostBelongsToBlockedUser = expressAsyncHandler(async(req, res, next) => {

    const {postId} = req.params;

    const post = await Post.findOne({
        where: {
            id: postId
        },
        attributes: ["id", "UserId"]
    });

    const block = await Block.findOne({
        where: {
            [Op.or]: [
                {
                    BlockerId: req.user.id,
                    BlockedId: post.UserId
                },
                {
                    BlockedId: req.user.id,
                    BlockerId: post.UserId
                }
            ]

        },
        attributes: ["id", "BlockedId"]
    });

    if(block){
        return next(new CustomError(400, "You can not access this route due to block"));
    }

    next();

});

export const checkReportExists = expressAsyncHandler(async(req, res, next) => {

    const {reportId} = req.params;

    const report = await Report.findOne({
        where: {
            id: reportId
        },
        attributes: ["id"]
    });

    if(!report){
        return next(new CustomError(400, "Report was not found"));
    }

    next();

});

export const checkFollowRequestExists = expressAsyncHandler(async(req, res, next) => {

    const {followRequestId} = req.params;

    const followRequest = await FollowRequest.findOne({
        where: {
            id: followRequestId,
            isVisible: true
        },
        attributes: ["id"]
    });

    if(!followRequest){
        return next(new CustomError(404, "Follow request not found"));
    }

    next();

});

export const checkPostBelongsToUser = expressAsyncHandler(async(req, res, next) => {

    const {username, postId} = req.params;

    const post = await Post.findOne({
        where: {
            id: postId
        },
        include: {
            model: User,
            where: {username: username}
        }
    });


    if(!post){
        return next(new CustomError(400, "This post is not belong to specified user"));
    }

    next();

});

export const checkVerifyRequestExists = expressAsyncHandler(async(req, res, next) => {

    const {verifyRequestId} = req.params;

    const verifyRequest = await VerifyRequest.findOne({
        where: {
            id: verifyRequestId
        },
        attributes: ["id"]
    }) ;

    if(!verifyRequest){
        return next(new CustomError(404, "There is no verify request with that id"));
    }

    next();

});

export const checkRoomExists = expressAsyncHandler(async(req, res, next) => {

    const {roomId} = req.params;

    const room = await Room.findOne({
        where: {
            id: roomId
        },
        attributes: ["id"]
    });

    if(!room){
        return next(new CustomError(404, "There is no conversation with that id"));
    }

    next();

});

export const checkIsRoomMember = expressAsyncHandler(async(req, res, next) => {

    const {roomId} = req.params;

    const room = await Room.findOne({
        where: {
            id: roomId
        },
        include: {
            model: User,
            attributes: ["id"],
            where: {
                id: req.user.id
            }
        }
    });

    if(!room){
        return next(new CustomError(403, "You are not member of this conversation"));
    }

    next();

});