import expressAsyncHandler from "express-async-handler";
import Post from "../models/Post.js";
import CustomError from "../services/error/CustomError.js";

export const createPost = expressAsyncHandler(async(req, res, next) => {

    const {content} = req.body;
    const file = req.file;

    if(!content && !file){

        return next(new CustomError(400, "Please provide at least a content or image"));
    }

    await Post.create({
        content: content ? content : null,
        imageUrl: file ? file.filename : null,
        UserId: req.user.id
    });

    return res
    .status(201)
    .json({
        success: true,
        message: "Post has been created"
    });

});

export const updatePost = expressAsyncHandler(async(req, res, next) => {

    const {content} = req.body;
    const {postId} = req.params;
    
    const post = await Post.findOne({
        where: {
            id: postId
        },
        attributes: ["id", "content"]
    });

    if(!post.content){
        return next(new CustomError(400, "Post does not have a content, therefore you can not edit this post"));
    }

    post.content = content;
    await post.save();

    return res
    .status(200)
    .json({
        success: true,
        message: "Post has been updated"
    });

});

export const hidePost = expressAsyncHandler(async(req, res, next) => {

    const {postId} = req.params;

    const post = await Post.findOne({
        where: {
            id: postId
        },
        attributes: ["id", "isVisible"]
    });

    post.isVisible = false;
    await post.save();

    return res
    .status(200)
    .json({
        success: true,
        message: "Your post has been hid"
    });

});