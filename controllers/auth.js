import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js";
import { validatePassword } from "../utils/inputHelpers.js";
import CustomError from "../services/error/CustomError.js";
import { sendEmailVerificationMail } from "../services/mail/mail.service.js";


export const signUp = expressAsyncHandler(async(req, res, next) => {

    const {
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
            firstName: firstName,
            lastName: lastName,
            email:email,
            password: password,
            gender: gender,
            dateOfBirth: dateOfBirth
    });

    sendEmailVerificationMail(user);

    return res
    .status(200)
    .json({
        success: true,
        message: "Email verification link sent"
    })

});