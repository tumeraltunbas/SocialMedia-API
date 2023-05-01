import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { createToken } from "../../utils/tokenHelpers.js";
import expressAsyncHandler from "express-async-handler";

dotenv.config({path: "./config/config.env"});

const {SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS} = process.env;

export const sendMail = (mailOptions) => {

    const transport = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
    });

    transport.sendMail(mailOptions);

}

export const sendEmailVerificationMail = expressAsyncHandler(async(user) =>{

    const {EMAIL_VERIFICATION_TOKEN_EXPIRES, DOMAIN} = process.env;

    const emailVerificationToken = createToken();

    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationTokenExpires = new Date(Date.now() + Number(EMAIL_VERIFICATION_TOKEN_EXPIRES));

    await user.save();

    const link = `${DOMAIN}/api/auth/email/verify?emailVerificationToken=${emailVerificationToken}`;

    const mailOptions = {
        from: SMTP_USER,
        to: user.email,
        subject: "Email Verification",
        html: `Your email verification <a href='${link}'>link here</a>. This link is only valid for 30 minutes.`
    };

    sendMail(mailOptions);

});