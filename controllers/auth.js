import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js";
import { validateInputs, validatePassword } from "../utils/inputHelpers.js";
import CustomError from "../services/error/CustomError.js";
import { sendEmailVerificationMail } from "../services/mail/mail.service.js";
import bcrypt from "bcryptjs";
import { saveJwtToCookie } from "../utils/tokenHelpers.js";
import { Op } from "sequelize";


export const signUp = expressAsyncHandler(async(req, res, next) => {

    const {
        username,
        firstName,
        lastName,
        email,
        password,
        gender,
        dateOfBirth
    } = req.body

    if(!validatePassword(password)){

        return next(new CustomError(400, "Your password must contain: Minimum eight characters, at least one uppercase letter, one lowercase letter and one number"));
    }

    const user = await User.create({
            username: username,
            firstName: firstName,
            lastName: lastName,
            email:email,
            password: password,
            gender: gender,
            dateOfBirth: dateOfBirth
        });

    sendEmailVerificationMail(user);

    return res
    .status(201)
    .json({
        success: true,
        message: "Email verification link sent"
    })

});

export const signIn = expressAsyncHandler(async(req, res, next) => {

    const {username, password} = req.body;
    
    const user = await User.findOne({
        where: {
            username: username,
        },
        attributes: [
            "id",
            "password", 
            "isTwoFactorEnabled", 
            "isBlocked", 
            "isActive",
            "isEmailVerified"
        ]
    });

    if(!bcrypt.compareSync(password, user.password)){

        return next(new CustomError(400, "Check your credentials"));
    }
    
    if(user.isBlocked === false && user.isActive === false){

        user.isActive = true;
        await user.save();
    }

    if(user.isTwoFactorEnabled){

        return res
        .status(200)
        .json({
            success: true,
            username: username 
        });

    }

    if(user.isEmailVerified != true){       

        await user.reload({attributes: [
            "email",
            "emailVerificationToken",
            "emailVerificationTokenExpires",
        ]});
        
        sendEmailVerificationMail(user);
        return next(new CustomError(400, "You need to verify your email"));        
    }

    saveJwtToCookie(user, res);

});

export const verifyEmail = expressAsyncHandler(async(req, res, next) => {

    const {emailVerificationToken} = req.query;

    const user = await User.findOne({
        where: {
            [Op.and]: [
                {emailVerificationToken: emailVerificationToken},
                {emailVerificationTokenExpires: {[Op.gt]: Date.now()}}
            ]
        },
        attributes: [
            "id", 
            "emailVerificationToken", 
            "emailVerificationTokenExpires", 
            "isEmailVerified"
        ]
    });

    if(!user){
        return next(new CustomError(400, "Your email verification token wrong or expired"));
    }

    user.emailVerificationToken = null;
    user.emailVerificationTokenExpires = null;
    user.isEmailVerified = true;

    await user.save();

    return res
    .status(200)
    .json({
        success: true,
        message: "Your email has been verified"
    });

});

export const sendEmail = expressAsyncHandler(async(req, res, next) => {

    const {username} = req.body;

    const user = await User.findOne({
        where: {
            username : username
        },
        attributes: [
            "id",
            "email",
            "emailVerificationToken",
            "emailVerificationTokenExpires",
            "isEmailVerified"
        ]
    });

    if(user.isEmailVerified){
        return next(new CustomError(400, "Your email has alredy been verified"));
    }

    sendEmailVerificationMail(user);

    return res
    .status(200)
    .json({
        success: true,
        message: "Email verification link successfully sent"
    });

});

export const changePassword = expressAsyncHandler(async(req, res, next) => {

    const {
        oldPassword, 
        newPassword, 
        newPasswordRepeat
    } = req.body;
    
    
    if(validateInputs(oldPassword, newPassword, newPasswordRepeat)){
        return next(new CustomError(400, "Please fill all the inputs"));
    }
    
    const user = await User.findOne({
        where: {
            id: req.user.id,
            isActive: true
        },
        attributes: [
            "id",
            "password",
            "lastPasswordChangedAt"
        ]
    });

    if(newPassword !== newPasswordRepeat){
        return next(new CustomError(400, "Passwords do not match"));
    }

    if(!bcrypt.compareSync(oldPassword, user.password)){
        return next(new CustomError(400, "Old password is invalid"));
    }

    user.password = newPassword;
    user.lastPasswordChangedAt = Date.now();

    await user.save();

    return res
    .status(200)
    .json({
        success: true,
        message: "Your password has been changed"
    });

});