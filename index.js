import express from "express";
import dotenv from "dotenv";
import "./services/database/db.services.js"; //database connection
import { errorHandler } from "./middlewares/error/errorHandler.js";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import "./models/index.js";
import cors from "cors";
import apiLimiter from "express-rate-limit";

dotenv.config({path: "./config/config.env"});
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));
app.use(express.static("public"));
app.use(apiLimiter({
    windowMs: 10 * 60 * 1000,
    max: 200,
    message: "Too many request were made from this IP. Please try again after 10"
}));
app.use("/api", routes);
app.use(errorHandler);

app.get("*", (req, res) => {

    return res
    .status(404)
    .json({
        success: false,
        message: "Route not found"
    });

});

app.listen(process.env.PORT, () => console.log(`Server is up at ${process.env.PORT}`));