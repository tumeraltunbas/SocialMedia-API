import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js";
import CustomError from "../services/error/CustomError.js";
import { sendPhoneCodeService } from "../services/sms/sms.service.js";
import { sendEmailVerificationMail } from "../services/mail/mail.service.js";
import { capitalize } from "../utils/inputHelpers.js";

export const uploadProfileImage = expressAsyncHandler(async(req, res, next) => {

    const profileImage = req.file;

    if(!profileImage){
        return next(new CustomError(400, "Please provide an image"));
    }

    if(profileImage.mimetype != "image/jpeg" && profileImage.mimetype != "image/png"){

        return next(new CustomError(400, "Profile image must be jpeg or png"));
    }

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: ["id", "profileImageUrl"]
    });

    user.profileImageUrl = profileImage.filename;
    await user.save();

    return res
    .status(200)
    .json({
        success: true,
        message: "Your profile photo has been uploaded"
    });

});

export const updateProfile = expressAsyncHandler(async(req, res, next) => {

    const informations = req.body;

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: [
            "id",
            "username",
            "firstName",
            "lastName",
            "gender",
            "dateOfBirth",
        ]
    });

    if(informations.firstName){

        informations.firstName = capitalize(informations.firstName);
    }

    if(informations.lastName){
        
        informations.lastName = capitalize(informations.lastName);
    }

    await user.update({...informations});

    return res
    .status(200)
    .json({
        success: true,
        message: "Your profile has been updated"
    });

});

export const addPhoneNumber = expressAsyncHandler(async(req, res, next) => {

    const {phoneNumber} = req.body;

    if(!phoneNumber){
        return next(new CustomError(400, "Please provide a phone number"));
    }

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: ["id", "phoneNumber", "phoneCode", "phoneCodeExpires"]
    });

    user.phoneNumber = phoneNumber;
    await sendPhoneCodeService(user);

    return res
    .status(200)
    .json({
        success: true,
        message: "Your phone code has been added"
    });

});

export const changePhoneNumber = expressAsyncHandler(async(req, res, next) => {

    const {phoneNumber} = req.body;

    if(!phoneNumber){
        return next(new CustomError(400, "Please provide a phone number"));
    }

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: [
            "id",
            "phoneNumber",
            "phoneCode",
            "phoneCodeExpires",
            "isPhoneVerified"
        ]
    });

    user.phoneNumber = phoneNumber;
    user.isPhoneVerified = false;

    sendPhoneCodeService(user);
    
    return res
    .status(200)
    .json({
        success: true,
        message: "Your phone number has been updated"
    });

});

export const changeEmail = expressAsyncHandler(async(req, res, next) => {

    const {email} = req.body;

    if(!email){
        return next(new CustomError(400, "Please provide an email"));
    }
    
    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: [
            "id",
            "email",
            "emailVerificationToken",
            "emailVerificationTokenExpires",
            "isEmailVerified"
        ]
    });

    user.email = email;
    user.isEmailVerified = false;

    sendEmailVerificationMail(user);

    return res
    .status(200)
    .json({
        success: true,
        message: "Your email has been changed"
    });

});