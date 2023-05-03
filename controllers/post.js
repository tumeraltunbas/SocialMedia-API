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