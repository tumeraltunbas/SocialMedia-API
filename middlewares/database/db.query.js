import expressAsyncHandler from "express-async-handler";
import User from "../../models/User.js";
import CustomError from "../../services/error/CustomError.js";
import { Op } from "sequelize";

export const checkUserExists = expressAsyncHandler(async(req, res, next) => {

    const key = req.body.username || req.body.email;

    const user = await User.findOne({
        where: {
            [Op.or]: [
                {username: key},
                {email: key}
            ]
        },
        attributes: ["id"]
    });

    if(!user){
        return next(new CustomError(404, "User not found"));
    }

    next();

});