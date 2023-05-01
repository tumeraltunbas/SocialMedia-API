import express from "express";
import dotenv from "dotenv";
import "./services/database/db.services.js"; //database connection

dotenv.config({path: "./config/config.env"});
const app = express();




app.listen(process.env.PORT, () => console.log(`Server is up at ${process.env.PORT}`));