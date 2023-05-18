import expressAsyncHandler from "express-async-handler";
import SavedPost from "../models/SavedPost.js";
import CustomError from "../services/error/CustomError.js";

export const savePost = expressAsyncHandler(async(req, res, next) => {

    const {postId} = req.params;

    const savedPost = await SavedPost.findOne({
        where: {
            PostId: postId,
            UserId: req.user.id
        },
        attributes: ["id"]
    });

    if(savedPost){
        return next(new CustomError(400, "You have already saved this post"));
    }

    await SavedPost.create({
        PostId: postId,
        UserId: req.user.id,
    });

    return res
    .status(201)
    .json({
        success: true,
        message: "The post has been saved"
    });

});

export const undoSavePost = expressAsyncHandler(async(req, res, next) => {

    const { postId } = req.params;

    const savedPost = await SavedPost.findOne({
        where: {
            PostId: postId,
            UserId: req.user.id 
        }
    });

    if(!savedPost){
        return next(new CustomError(400, "You already did not save this post"));
    }

    await savedPost.destroy();

    return res
    .status(200)
    .json({
        success: true,
        message: "Post has been successfully unsaved"
    });

});