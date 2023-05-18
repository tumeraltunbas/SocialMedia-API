import expressAsyncHandler from "express-async-handler";
import User from "../../models/User.js";
import { paginationHelper, userSearchHelper } from "./queryMiddlewareHelpers.js";

export const userQueryMiddleware = expressAsyncHandler(async(req, res, next) => {

    const {startIndex, limit, pagination} = await paginationHelper(req, User);

    const where = userSearchHelper(req);

    req.userQuery = {
        startIndex,
        limit,
        pagination,
        where
    };

    next();

});