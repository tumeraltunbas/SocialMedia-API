import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import Comment from "../../models/Comment.js";
import CustomError from "../../services/error/CustomError.js";

export const isAuth = (req, res, next) => {

    const {JWT_SECRET} = process.env;

    const token = req.cookies.jwt;

    jwt.verify(token, JWT_SECRET, (err, decoded) => {

        if(err) return next(err);

        req.user = {
            id: decoded.id,
            username: decoded.username
        };

        next();

    });

}

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