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

export const checkUserFollowing = expressAsyncHandler(async(req, res, next) => {

    const {username} = req.params;

    const user = await User.findOne({
        where: {
            username: username
        },
        attributes: ["id", "isPrivateAccount"]
    });

    req.followStatus = true;

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
        req.followStatus = false;
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
            BlockerId: req.user.id,
            BlockedId: user.id
        },
        attributes: ["id"]
    });

    if(block){
        return next(new CustomError(400, "You can not access this route because you blocked that user"));
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
            BlockerId: req.user.id,
            BlockedId: post.UserId
        },
        attributes: ["id", "BlockedId"]
    });

    if(block){
        return next(new CustomError(400, "You can not access this route because you blocked that user"));
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