import expressAsyncHandler from "express-async-handler";
import BackupCode from "../models/BackupCode.js";
import User from "../models/User.js";
import speakeasy from "speakeasy";

export const createBackupCodes = expressAsyncHandler(async(req, res, next) => {

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: ["id", "twoFactorSecret"]
    });

    const backupCodes = [];

    for(let i=0; i<5; i++ ){

        const otp = speakeasy.totp({
            secret: user.twoFactorSecret,
            encoding: "base32",
            digits: 8,
            counter: i
        });

        const backupCode = await BackupCode.create({backupCode: otp});
        await user.addBackupCode(backupCode);
        
        backupCodes.push(otp);
    }

    return res
    .status(200)
    .json({
        success: true,
        backupCodes: backupCodes
    });
    
});

