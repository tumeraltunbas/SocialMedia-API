import expressAsyncHandler from "express-async-handler";
import Like from "../models/Like.js";

export const likePost = expressAsyncHandler(async(req, res, next) => {

    const {postId} = req.params;
    
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
        post: post
    });

});