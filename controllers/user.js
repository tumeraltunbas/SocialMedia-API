import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js";
import CustomError from "../services/error/CustomError.js";

export const uploadProfileImage = expressAsyncHandler(async(req, res, next) => {

    const profileImage = req.file;

    if(!profileImage){
        return next(new CustomError(400, "Please provide an image"));
    }

    if(profileImage.mimetype != "image/jpeg" && profileImage.mimetype != "image/png"){

        return next(new CustomError(400, "Profile image must be jpeg or png"));
    }

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: ["id", "profileImageUrl"]
    });

    user.profileImageUrl = profileImage.filename;
    await user.save();

    return res
    .status(200)
    .json({
        success: true,
        message: "Your profile photo has been uploaded"
    });

});