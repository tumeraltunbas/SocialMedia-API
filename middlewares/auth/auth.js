import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import Comment from "../../models/Comment.js";
import CustomError from "../../services/error/CustomError.js";
import Post from "../../models/Post.js";
import User from "../../models/User.js";

export const isAuth = (req, res, next) => {

    const {JWT_SECRET} = process.env;
    
    if(!req.cookies.jwt && !req.headers.authorization){
        return next(new CustomError(400, "Please provide a jsonwebtoken"));
    }

    const token = req.cookies.jwt || req.headers.authorization.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {

        if(err) return next(err);

        req.user = {
            id: decoded.id,
        };

        next();

    });

}

export const getPostOwnerAccess = expressAsyncHandler(async(req, res, next) => {

    const {postId} = req.params;

    const post = await Post.findOne({
        where: {
            id: postId,
            isVisible: true
        },
        attributes: ["id", "UserId"]
    });

    if(post.UserId != req.user.id){
        return next(new CustomError(403, "You are not owner of this post"));
    }

    next();

});

export const getCommentOwnerAccess = expressAsyncHandler(async(req, res, next) => {

    const {commentId} = req.params;

    const comment = await Comment.findOne({
        where: {
            id: commentId,
            isVisible: true
        },
        attributes: ["id", "UserId"]
    });

    if(comment.UserId != req.user.id){
        return next(new CustomError(403, "You are not owner of this comment"));
    }

    next();

});

export const getAdminAccess = expressAsyncHandler(async(req, res, next) => {

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: ["id", "isAdmin"]
    });

    if(user.isAdmin != true){
        return next(new CustomError(403, "Only admins can access this route"));
    }

    next();

});