import expressAsyncHandler from "express-async-handler";
import Report from "../models/Report.js";
import { capitalize } from "../utils/inputHelpers.js";
import CustomError from "../services/error/CustomError.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const reportPost = expressAsyncHandler(async(req, res, next) => {

    const {postId} = req.params;
    const {details} = req.body;

    if(!details){
        return next(new CustomError(400, "You must provide detail informations about report"));
    }

    const post = await Post.findOne({
        where: {
            id: postId
        },
        attributes: ["id", "UserId"]
    });

    if(post.UserId === req.user.id){
        return next(new CustomError(400, "You can not report your post"));
    }

    const report = await Report.findOne({
        where: {
            UserId: req.user.id,
            PostId: postId,
        },
        attributes: ["id"]
    });
    
    if(report){
        return next(new CustomError(400, "You have already reported this post"))
    }

    await Report.create({
        UserId: req.user.id,
        PostId: postId,
        details: capitalize(details)
    });

    return res
    .status(201)
    .json({
        success: true,
        message: "Post has been reported"
    });

});

export const getReportsByPostId = expressAsyncHandler(async(req, res, next) => {

    const { postId } = req.params;

    const reports = await Report.findAll({
        where: {
            PostId: postId,
            isVisible: true
        },
        order: [["createdAt", "asc"]],
        include: [
            { 
                model: User, 
                attributes: ["id", "username"]
            },
            {
                model: Post,
                attributes: ["id", "imageUrl", "content"],
                include: {
                    model: User,
                    attributes: ["id", "username"]
                }   
            }
        ]
    });

    return res
    .status(200)
    .json({
        success: true,
        reports: reports 
    });

});