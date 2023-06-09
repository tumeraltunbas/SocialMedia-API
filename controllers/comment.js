import expressAsyncHandler from "express-async-handler";
import Comment from "../models/Comment.js";
import CustomError from "../services/error/CustomError.js";
import User from "../models/User.js";

export const getCommentsByPostId = expressAsyncHandler(async(req, res, next) => {

    const {postId} = req.params;
    
    if(req.profileAccess === false){
        return next(new CustomError(403, "You can not access this route because you are not following this user"));
    }

    const comments = await Comment.findAll({
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
        attributes: [
            "id",
            "content",
            "imageUrl",
            "createdAt"
        ]
    });

    return res
    .status(200)
    .json({
        success: true,
        comments: comments
    });

});

export const createComment = expressAsyncHandler(async(req, res, next) => {

    const {postId} = req.params;
    const {content} = req.body;
    const file = req.file

    if(req.profileAccess === false){
        return next(new CustomError(403, "You can not access this route because you are not following this user"));
    }

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

    if(req.profileAccess === false){
        return next(new CustomError(403, "You can not access this route because you are not following this user"));
    }

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

export const hideComment = expressAsyncHandler(async(req, res, next) => {

    const {commentId} = req.params;

    const comment = await Comment.findOne({
        where: {
            id: commentId,
            isVisible: true,
        },
        attributes: ["id", "isVisible", "isHidByUser"]
    });

    comment.isVisible = false;
    comment.isHidByUser = true;

    await comment.save();

    return res
    .status(200)
    .json({
        success: true,
        message: "Comment has been hid"
    });

});