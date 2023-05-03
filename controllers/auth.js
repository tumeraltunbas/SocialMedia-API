import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js";
import { validateInputs, validatePassword } from "../utils/inputHelpers.js";
import CustomError from "../services/error/CustomError.js";
import { sendEmailVerificationMail, sendMail } from "../services/mail/mail.service.js";
import bcrypt from "bcryptjs";
import { createToken, saveJwtToCookie } from "../utils/tokenHelpers.js";
import { Op } from "sequelize";
import moment from "moment";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import BackupCode from "../models/BackupCode.js";
import { sendPhoneCodeService } from "../services/sms/sms.service.js";

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

export const logout = expressAsyncHandler(async(req, res, next) => {

    res
    .status(200)
    .clearCookie("jwt")
    .json({
        success: true,
        message: "Logout successfull"
    });

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
        passwordRepeat
    } = req.body;
    
    
    if(!validateInputs(oldPassword, newPassword, passwordRepeat)){
        return next(new CustomError(400, "Please fill all the inputs"));
    }
    
    const user = await User.findOne({
        where: {
            id: req.user.id,
            isActive: true
        },
        attributes: [
            "id",
            "email",
            "password",
            "lastPasswordChangedAt"
        ]
    });

    if(newPassword !== passwordRepeat){
        return next(new CustomError(400, "Passwords do not match"));
    }

    if(!bcrypt.compareSync(oldPassword, user.password)){
        return next(new CustomError(400, "Old password is invalid"));
    }

    user.password = newPassword;
    user.lastPasswordChangedAt = Date.now();

    await user.save();

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: user.email,
        subject: "Your password has been changed",
        html: `<p>Your password has been changed at ${moment(user.lastPasswordChangedAt).format("DD MM YYYY hh:mm:ss")}. If you did not do this, please contact us.</p>`
    }

    sendMail(mailOptions);

    return res
    .status(200)
    .clearCookie(jwt)
    .json({
        success: true,
        message: "Your password has been changed"
    });

});

export const forgotPassword = expressAsyncHandler(async(req, res, next) => {

    const key = req.body.email || req.body.username;
    const {DOMAIN, RESET_PASSWORD_TOKEN_EXPIRES, SMTP_USER} = process.env; 

    const user = await User.findOne({
        where: {
            [Op.or]: [
                {username: key},
                {email: key}
            ],
            isActive: true
        },
        attributes: [
            "id", 
            "resetPasswordToken", 
            "resetPasswordTokenExpires",
            "email"
        ]
    });

    const token = createToken();
    
    user.resetPasswordToken = token;
    user.resetPasswordTokenExpires = new Date(Date.now() + Number(RESET_PASSWORD_TOKEN_EXPIRES));
    
    await user.save();

    const link = `${DOMAIN}/api/auth/password/reset?resetPasswordToken=${token}`;

    const mailOptions = {
        from: SMTP_USER,
        to: user.email,
        subject: "Reset Password",
        html: `<p>Your reset password <a href='${link}'>link</a>. This link is valid for 30 minutes</p>`
    };

    sendMail(mailOptions);

    return res
    .status(200)
    .json({
        success: true,
        message: "Reset password link successfully sent"
    });

});

export const resetPassword = expressAsyncHandler(async(req, res, next) => {

    const {resetPasswordToken} = req.query;

    const {password, passwordRepeat} = req.body;

    if(!resetPasswordToken){
        return next(new CustomError(400, "Reset password token can not be null"));
    }

    const user = await User.findOne({
        where: {
            [Op.and]: [
                {resetPasswordToken: resetPasswordToken},
                {resetPasswordTokenExpires: {[Op.gt]: Date.now()}}
            ],
        },
        attributes: [
            "id",
            "resetPasswordToken",
            "resetPasswordTokenExpires",
            "password",
            "lastPasswordChangedAt"
        ]
    });

    if(!user){
        return next(new CustomError(400, "Your reset password token is wrong or expired"));
    }

    if(password !== passwordRepeat){
        return next(new CustomError(400, "Passwords do not match"));
    }

    if(!validatePassword(password)){
        return next(new CustomError(400, "Your password must contain: Minimum eight characters, at least one uppercase letter, one lowercase letter and one number"));
    }

    if(bcrypt.compareSync(password, user.password)){
        return next(new CustomError(400, "Your new password can not be same with old one"));
    }

    user.resetPasswordToken = null;
    user.resetPasswordTokenExpires = null;
    user.password = password;
    user.lastPasswordChangedAt = Date.now();

    await user.save();

    return res
    .status(200)
    .json({
        success: true,
        message: "Your password has been changed"
    });

});

export const enable2FA = expressAsyncHandler(async(req, res, next) => {

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: ["id", "twoFactorSecret"]
    });

    const twoFactorSecret = speakeasy.generateSecret({length: 15, name: "SocialMedia-API"});

    const qrCode = await qrcode.toDataURL(twoFactorSecret.otpauth_url);
    const key = twoFactorSecret.otpauth_url.split("=")[1];
    
    user.twoFactorSecret = twoFactorSecret.base32;
    await user.save();

    return res
    .status(200)
    .json({
        success: true,
        qrCode: qrCode,
        key: key
    });

});

export const verify2FA = expressAsyncHandler(async(req, res, next) => {

    const {code} = req.body;

    if(!code){
        return next(new CustomError(400, "Please provide a code"));
    }

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: ["id", "twoFactorSecret", "isTwoFactorEnabled"]
    });

    const verify = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: code,
    });

    if(!verify){
        return next(new CustomError(400, "The code you entered is wrong"));
    }

    user.isTwoFactorEnabled = true;
    await user.save();

    return res
    .status(200)
    .json({
        success: true,
        message: "2FA has been enabled"
    });

});

export const validate2FA = expressAsyncHandler(async(req, res, next) => {

    const {username, code} = req.body;

    if(!validateInputs(username,code)){
        return next(new CustomError(400, "Please provide all inputs"));
    }

    const user = await User.findOne({
        where: {
            username: username
        },
        attributes: ["id", "twoFactorSecret"]
    })

    const verify = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: code
    });

    if(!verify){

        const backupCode = await BackupCode.findOne({
            where: {
                backupCode: code
            },
            include: {
                model: User,
                where: { id: user.id }
            },
        });

        if(!backupCode){
            return next(new CustomError(400, "The code you entered is wrong"));
        }

        await backupCode.destroy();

    }

    saveJwtToCookie(user,res);

});

export const disable2FA = expressAsyncHandler(async(req, res, next) => {

    const {code, password} = req.body;

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: ["id", "twoFactorSecret", "isTwoFactorEnabled", "password"]
    });

    if(!validateInputs(code, password)){
        return next(new CustomError(400, "Please provide all inputs"));
    }

    if(!bcrypt.compareSync(password, user.password)){
        return next(new CustomError(400, "The password you entered is invalid"));
    }

    const verify = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: code
    });

    if(!verify){
        return next(new CustomError(400, "The code you entered is wrong"));
    }

    user.twoFactorSecret = null;
    user.isTwoFactorEnabled = false;

    await user.save();

    return res
    .status(200)
    .json({
        success: true,
        message: "2FA has been disabled"
    });

});

export const sendPhoneCode = expressAsyncHandler(async(req, res, next) => {

    const {username} = req.body;

    const user = await User.findOne({
        where: {
            username: username,
        },
        attributes: ["id", "phoneNumber", "phoneCode", "phoneCodeExpires"]
    });

    if(!user.phoneNumber){
        return next(new CustomError(400, "User does not have a phone number"));
    }

    await sendPhoneCodeService(user);

    return res
    .status(200)
    .json({
        success: true,
        message: "Phone code has been successfully sent"
    });

});

export const verifyPhone = expressAsyncHandler(async(req, res, next) => {

    const {code} = req.body;

    const user = await User.findOne({
        where: {
            id: req.user.id,
            [Op.and] : [
                { phoneCode: code },
                { phoneCodeExpires: { [Op.gt]: Date.now() }}
            ]
        },
        attributes: ["id", "phoneCode", "phoneCodeExpires", "isPhoneVerified"]
    });

    if(!user){
        return next(new CustomError(400, "Your phone code wrong or expired"));
    }

    user.phoneCode = null;
    user.phoneCodeExpires = null;
    user.isPhoneVerified = true;

    await user.save();

    return res
    .status(200)
    .json({
        success: true,
        message: "Your phone number has been verified"
    });

});

export const deactivateAccount = expressAsyncHandler(async(req, res, next) => {

    const {password} = req.body;

    if(!password){
        return next(new CustomError(400, "Please provide a password"));
    }

    const user = await User.findOne({
        where: {
            id: req.user.id,
            isActive: true
        },
        attributes: ["id", "password", "isActive"]
    });

    if(!bcrypt.compareSync(password, user.password)){
        return next(new CustomError(400, "Password is invalid"));
    }

    user.isActive = false;
    await user.save();

    return res
    .status(200)
    .clearCookie(jwt)
    .json({
        success: true,
        message: "Your account has been deactivated"
    });

});