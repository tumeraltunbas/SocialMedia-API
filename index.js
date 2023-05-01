import express from "express";
import dotenv from "dotenv";
import "./services/database/db.services.js"; //database connection
import { errorHandler } from "./middlewares/error/errorHandler.js";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";

dotenv.config({path: "./config/config.env"});
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);
app.use(errorHandler);

app.listen(process.env.PORT, () => console.log(`Server is up at ${process.env.PORT}`));