import expressAsyncHandler from "express-async-handler";
import User from "../../models/User.js";
import CustomError from "../../services/error/CustomError.js";
import { Op } from "sequelize";
import Post from "../../models/Post.js";
import Follow from "../../models/Follow.js";

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
        attributes: ["id"]
    });

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

    if(!follow){
        return next(new CustomError(404, "You are not following this user"));
    }

    next();

});