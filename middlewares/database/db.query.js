import expressAsyncHandler from "express-async-handler";
import User from "../../models/User.js";
import CustomError from "../../services/error/CustomError.js";

export const checkUserExists = expressAsyncHandler(async(req, res, next) => {

    const {username} = req.body;

    const user = await User.findOne({
        where: {
            username: username,
        },
        attributes: ["id"]
    });

    if(!user){
        return next(new CustomError(404, "User not found with this username"));
    }

    next();

});