import { generate } from "randomstring";
import bcrypt from "bcryptjs";
import randomInteger from "random-int";

export const createToken = () => {

    const randomString = generate(15);
    //Hash
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(randomString, salt);

    return hash;
    
}

export const saveJwtToCookie = (user, res) => {

    const {COOKIE_EXPIRES, NODE_ENV} = process.env;

    const jwt = user.createJwt();
    const refreshToken = user.createRefreshToken();

    return res
    .status(200)
    .cookie("jwt", jwt, {
        maxAge: COOKIE_EXPIRES,
        httpOnly: NODE_ENV === "development" ? true : false
    })
    .json({
        success: true,
        refreshToken: refreshToken
    });

}

export const generateOtp = () => {

    const otp = randomInteger(10000000, 99999999).toString();
    return otp;
}