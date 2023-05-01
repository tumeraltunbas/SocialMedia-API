import { generate } from "randomstring";
import bcrypt from "bcryptjs";

export const createToken = () => {

    const randomString = generate(15);
    //Hash
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(randomString, salt);

    return hash;
    
}