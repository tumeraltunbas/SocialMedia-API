import twilio from "twilio";
import expressAsyncHandler from "express-async-handler";
import { generateOtp } from "../../utils/tokenHelpers.js";

const {TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER} = process.env;

export const sendSms = expressAsyncHandler(async(phoneNumber, text) => {
    
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    await client.messages.create({
        from: TWILIO_PHONE_NUMBER,
        to: phoneNumber,
        body: text
    });
   
});

export const sendPhoneCode = expressAsyncHandler(async(user) => {

    const {PHONE_CODE_EXPIRES} = process.env;

    const otp = generateOtp();
    user.phoneCode = otp;
    user.phoneCodeExpires = new Date(Date.now() + Number(PHONE_CODE_EXPIRES));

    await user.save();

    sendSms(user.phoneNumber, `Your phone code is ${user.phoneCode}. This code is valid for 30 minutes`);

});