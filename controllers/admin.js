import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js";
import Post from "../models/Post.js";
import CustomError from "../services/error/CustomError.js";

export const getAllUsers = expressAsyncHandler(async(req, res, next) => {

    const {startIndex, limit, pagination, where} = req.userQuery;

    const users = await User.findAll({
        where: where,
        offset: startIndex,
        limit: limit,
        order: [["username", "asc"]],
        attributes: [
            "id",
            "username",
            "firstName",
            "lastName",
            "isAdmin",
            "isActive",
            "createdAt"
        ]
    });

    return res
    .status(200)
    .json({
        success: true,
        users: users,
        pagination: pagination
    });

});

export const getAllPosts = expressAsyncHandler(async(req, res, next) => {

    const {startIndex, limit, pagination, where} = req.postQuery;

    const posts = await Post.findAll({
        where: where,
        offset: startIndex,
        limit: limit,
        order: [["createdAt", "asc"]],
        attributes: [
            "id",
            "content",
            "imageUrl",
            "UserId",
            "isVisible"
        ],
        include: {
            model: User,
            attributes: [
                "id",
                "username"
            ]
        }
    });

    return res
    .status(200)
    .json({
        success: true,
        posts: posts,
        pagination: pagination
    });


});

export const blockUserByAdmin = expressAsyncHandler(async(req, res, next) => {

    const {userId} = req.params;

    const user = await User.findOne({
        where: {
            id: userId
        },
        attributes: [
            "id", 
            "isBlocked",
            "isActive"
        ]
    });

    user.isBlocked = true;
    user.isActive = false;
    
    await user.save();

    return res
    .status(200)
    .json({
        success: true,
        message: "User has been blocked by admin"
    });

});

export const unblockUserByAdmin = expressAsyncHandler(async(req, res, next) => {

    const {userId} = req.params;

    const user = await User.findOne({
        where: {
            id: userId
        },
        attributes: [
            "id", 
            "isBlocked",
            "isActive"
        ]
    });

    if(user.isBlocked !== true){
        return next(new CustomError(400, "This user is not already blocked by admin"));
    }

    user.isBlocked = false;
    user.isActive = true;

    await user.save();

    return res
    .status(200)
    .json({
        success: true,
        message: "User has been unblocked by admin"
    });

});