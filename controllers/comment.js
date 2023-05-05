import expressAsyncHandler from "express-async-handler";
import Comment from "../models/Comment.js";
import CustomError from "../services/error/CustomError.js";

export const createComment = expressAsyncHandler(async(req, res, next) => {

    const {postId} = req.params;
    const {content} = req.body;
    const file = req.file

    if(!content && !file){

        return next(new CustomError(400, "Please provide at least a content or image"));
    }

    await Comment.create({
        content: content ? content : null,
        imageUrl: file ? file.filename : null,
        PostId: postId,
        UserId: req.user.id
    })

    return res
    .status(201)
    .json({
        success: true,
        message: "Comment has been created"
    })

});