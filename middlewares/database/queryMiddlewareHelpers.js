import expressAsyncHandler from "express-async-handler";
import { Op } from "sequelize";

export const postSearchHelper = (req) => {

    const {search} = req.query;

    let where = {
        isVisible: true
    }

    if(search){
        where.content = {[Op.like]: `%${search}%`}
    }

    return where;

};

export const paginationHelper = expressAsyncHandler(async(req, model) => {

    const page = req.query.page || 1;
    const limit = 15;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const totalCount = await model.count();

    const pagination = {};

    if(startIndex > 0){

        pagination.previous = {
            page: page - 1
        }
    }

    if(totalCount > endIndex){

        pagination.next = {
            page: page + 1
        }
    }

    return {startIndex, limit, pagination};

});