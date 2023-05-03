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

const upload = multer({storage: storage, fileFilter: fileFilter});
export default upload;