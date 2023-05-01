import { generate } from "randomstring";
import bcrypt from "bcryptjs";

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

    return res
    .status(200)
    .cookie("jwt", jwt, {
        maxAge: COOKIE_EXPIRES,
        httpOnly: NODE_ENV === "development" ? true : false
    });

}