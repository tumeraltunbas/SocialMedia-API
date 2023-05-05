import expressAsyncHandler from "express-async-handler";
import Post from "../models/Post.js";
import CustomError from "../services/error/CustomError.js";
import Comment from "../models/Comment.js";
import Like from "../models/Like.js";
import User from "../models/User.js";

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
    post.isHidByUser = true;
    await post.save();

    return res
    .status(200)
    .json({
        success: true,
        message: "Your post has been hid"
    });

});

export const getPostById = expressAsyncHandler(async(req, res, next) => {

    const {postId} = req.params;

    const post = await Post.findOne({
        where: {
            id: postId
        },
        include: [
            {
                model: Comment,
                attributes: ["id", "content", "imageUrl"]
            },
            {
                model: Like,
            }
        ],
        attributes: ["id", "content", "imageUrl"]
    });

    return res
    .status(200)
    .json({
        success: true,
        post: post,
        comments: post.Comments,
        commentLength: post.Comments.length,
        likeCount: post.Likes.length
    });

});

export const getFeed = expressAsyncHandler(async(req, res, next) => {

    const user = await User.findOne({
        where: {
            id: req.user.id
        }
    });

    const followings = await user.getFollowing({ attributes: ["id"] });
    
    let followingIds = []

    for (let i=0; i < followings.length; i++) {

        followingIds.push(followings[i].dataValues.id);
    }

    const posts = await Post.findAll({
        where: {
            UserId: followingIds,
            isVisible: true
        },
        include: {
            model: User,
            attributes: [
                "id",
                "username",
                "firstName",
                "lastName",
                "profileImageUrl"
            ]  
        },
        attributes: ["id", "content", "imageUrl", "createdAt"],
        order: [["createdAt", "desc"]]
    });

    return res
    .status(200)
    .json({
        success: true,
        posts: posts
    });

});