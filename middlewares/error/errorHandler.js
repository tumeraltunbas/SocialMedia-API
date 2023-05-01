import CustomError from "../../services/error/CustomError.js";

export const errorHandler = (err, req, res, next) => {
    
    return res
    .status(err.status || 500)
    .json({
        success:false, 
        message: err.message
    });

}