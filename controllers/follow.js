import expressAsyncHandler from "express-async-handler";
import Follow from "../models/Follow.js";
import User from "../models/User.js";
import CustomError from "../services/error/CustomError.js";

export const followUser = expressAsyncHandler(async(req, res, next) => {

    const {userId} = req.params;

    const user = await User.findOne({
        where: {
            id: userId
        },
        attributes: ["id"]
    });

    const follow = await Follow.findOne({
        where: {
            followerId: req.user.id,
            followingId: userId
        },
        attributes: ["id"]
    });

    if(follow){
        return next(new CustomError(400, "You are already following this user"));
    }

    await user.addFollower(req.user.id);

    return res
    .status(200)
    .json({
        success: true, 
    });

});