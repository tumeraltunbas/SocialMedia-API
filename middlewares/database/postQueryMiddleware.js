import expressAsyncHandler from "express-async-handler";
import Post from "../../models/Post.js";
import { paginationHelper, postSearchHelper } from "./queryMiddlewareHelpers.js"

export const postQueryMiddleware = expressAsyncHandler(async(req, res, next) => {

    const where = postSearchHelper(req);

    const {startIndex, limit, pagination} = await paginationHelper(req, Post);

    req.postQuery = {
        where,
        startIndex,
        limit,
        pagination
    }

    next();

});