import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js";

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