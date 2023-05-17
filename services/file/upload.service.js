import multer from "multer";
import root from "app-root-path";
import path from "path";
import CustomError from "../error/CustomError.js";

const storage = multer.diskStorage({

    destination: `${root.path}/public`,

    filename: function(req, file, cb){
        const fileName = Date.now() + path.extname(file.originalname);
        cb(null, fileName)
    },

});

const fileFilter = (req, file, cb) => {

    const acceptedMimetypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/x-msvideo"];

    if(!acceptedMimetypes.includes(file.mimetype)){
        return cb(new CustomError(400, "Unsupported file type"));
    }

    cb(null, true)

}

const imageFileFilter = (req, file, cb) => {

    const acceptedImageMimetypes = ["image/jpeg", "image/png"];
    
    if(!acceptedImageMimetypes.includes(file.mimetype)){
        return cb(new CustomError(400, "Unsupported file type"));
    }

    cb(null, true)
}

const imageUploader = multer({   

    storage: storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1048576 } // equals to 5 megabytes

});

const uploader = multer({

    storage: storage, 
    fileFilter: fileFilter, 
    limits: { fileSize: 30 * 1048576 } // equals to 30 megabytes

});

export {imageUploader, uploader};