import CustomError from "../../services/error/CustomError.js";
import {capitalize} from "../../utils/inputHelpers.js"

export const errorHandler = (err, req, res, next) => {
    
    if(err.name === "SequelizeUniqueConstraintError"){
        err.message = capitalize(err.errors[0].message);
    }

    return res
    .status(err.status || 500)
    .json({
        success:false, 
        message: err.message
    });

}