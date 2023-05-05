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

export const updateComment = expressAsyncHandler(async(req, res, next) => {

    const {commentId} = req.params;
    const {content} = req.body;

    const comment = await Comment.findOne({
        where: {
            id: commentId
        },
        attributes: ["id", "content"]
    });

    comment.content = content;
    await comment.save();

    return res
    .status(200)
    .json({
        success: true,
        message: "Comment has been updated"
    });

});