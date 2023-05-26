import express from "express";
import dotenv from "dotenv";
import "./services/database/db.services.js"; //database connection
import { errorHandler } from "./middlewares/error/errorHandler.js";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import "./models/index.js";
import cors from "cors";
import apiLimiter from "express-rate-limit";
import { WebSocketServer, WebSocket } from "ws";
import { isAuth } from "./middlewares/auth/auth.js";

dotenv.config({path: "./config/config.env"});
const app = express();

const wss = new WebSocketServer({port: 8081});

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: true}));
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

wss.on("connection", isAuth, (ws) => {


    //http://localhost:8080/api/messages/12345-123456
    
    ws.on("message", (message) => {


        wss.clients.forEach((client) => {

            if(client !== ws && client.readyState === WebSocket.OPEN){
                client.send(message.toString());
            }

        });

    });


});

app.listen(process.env.PORT, () => console.log(`Server is up at ${process.env.PORT}`));