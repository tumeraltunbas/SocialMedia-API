import expressAsyncHandler from "express-async-handler";
import Like from "../models/Like.js";
import CustomError from "../services/error/CustomError.js";
import User from "../models/User.js";

export const likePost = expressAsyncHandler(async(req, res, next) => {

    const {postId} = req.params;

    if(req.profileAccess === false){
        return next(new CustomError(403, "You can not access this route because you are not following this user"));
    }

    await Like.findOrCreate({
        where: {
            PostId: postId,
            UserId: req.user.id     
        }
    });

    return res
    .status(201)
    .json({
        success: true,
        message: "You successfully liked this post",
    });

});

export const undoLikePost = expressAsyncHandler(async(req, res, next) => {

    const {postId} = req.params;

    if(req.profileAccess === false){
        return next(new CustomError(403, "You can not access this route because you are not following this user"));
    }

    const like = await Like.findOne({
        where: {
            PostId: postId,
            UserId: req.user.id
        },
        attributes: ["id"]
    });

    if(!like){
        return next(new CustomError(400, "You already did not like this post"));
    }

    await like.destroy();

    return res
    .status(200)
    .json({
        success: true,
        message: "Like successfully withdrawn"
    });

});

export const getLikesByPostId = expressAsyncHandler(async(req, res, next) => {

    const {postId} = req.params;

    const likes = await Like.findAll({
        where: {
            PostId: postId
        },
        include: {
            model: User,
            attributes: [
                "id",
                "firstName",
                "lastName",
                "profileImageUrl"
            ]
        },
        attributes: ["id"]
    });

    return res
    .status(200)
    .json({
        success: true,
        likes: likes
    });

});