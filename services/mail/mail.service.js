import nodemailer from "nodemailer";
import dotenv from "dotenv";

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
