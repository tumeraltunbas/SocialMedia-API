import twilio from "twilio";
import expressAsyncHandler from "express-async-handler";

const {TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER} = process.env;

export const sendSms = expressAsyncHandler(async(phoneNumber, text) => {
    
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    await client.messages.create({
        from: TWILIO_PHONE_NUMBER,
        to: phoneNumber,
        body: text
    });
   
});