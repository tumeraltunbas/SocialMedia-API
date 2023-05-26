import express from "express";
import dotenv from "dotenv";
import "./services/database/db.services.js"; //database connection
import { errorHandler } from "./middlewares/error/errorHandler.js";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import "./models/index.js";
import cors from "cors";
import { WebSocketServer } from "ws";
import { sendMessage } from "./services/message/message.services.js";

dotenv.config({path: "./config/config.env"});
const app = express();

const wss = new WebSocketServer({port: 8081});

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: true}));
app.use(express.static("public"));
app.use("/api", routes);
app.use(errorHandler);

wss.on("connection", (ws, req) => {

    //http://localhost:8080/api/messages/12345-123456
    
    ws.on("message", (message) => {

        sendMessage(req, message.toString());

    });


});

app.listen(process.env.PORT, () => console.log(`Server is up at ${process.env.PORT}`));