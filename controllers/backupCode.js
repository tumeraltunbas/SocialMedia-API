import expressAsyncHandler from "express-async-handler";
import BackupCode from "../models/BackupCode.js";
import User from "../models/User.js";
import { generateOtp } from "../utils/tokenHelpers.js";

export const createBackupCodes = expressAsyncHandler(async(req, res, next) => {

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: ["id", "twoFactorSecret"]
    });

    const backupCodes = [];

    for(let i=0; i<5; i++ ){

        const otp = generateOtp();

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

export const refreshBackupCodes = expressAsyncHandler(async(req, res, next) => {

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: ["id"]
    });

    const backupCodes = await BackupCode.findAll({
        include: {
            model: User,
            where: { id: user.id }
        }
    });

    backupCodes.forEach(async(backupCode) => {
        await backupCode.destroy();
    });

    const newBackupCodes = [];

    for(let i=0; i<5; i++ ){

        const otp = generateOtp();

        const backupCode = await BackupCode.create({backupCode: otp});
        await user.addBackupCode(backupCode);
        
        newBackupCodes.push(otp);
    }

    return res
    .status(200)
    .json({
        success: true,
        backupCodes: newBackupCodes
    });

});