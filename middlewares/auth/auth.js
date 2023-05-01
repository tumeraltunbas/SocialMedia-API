import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {

    const {JWT_SECRET} = process.env;

    const token = req.cookies.jwt;

    jwt.verify(token, JWT_SECRET, (err, decoded) => {

        if(err) return next(err);

        req.user = {
            id: decoded.id,
            username: decoded.username
        };

        next();

    });

}