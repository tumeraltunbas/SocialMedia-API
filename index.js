import express from "express";
import dotenv from "dotenv";
import "./services/database/db.services.js"; //database connection
import { errorHandler } from "./middlewares/error/errorHandler.js";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import "./models/index.js";
import cors from "cors";
import { WebSocketServer } from "ws";
import {createServer} from "http2";

dotenv.config({path: "./config/config.env"});
const app = express();

const server = createServer(app);
const wss = new WebSocketServer({server: server});

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: true}));
app.use(express.static("public"));
app.use("/api", routes);
app.use(errorHandler);

wss.on("connection", (socket) => {
    console.log(`${socket} connected`);
});

server.listen(process.env.PORT, () => console.log(`Server is up at ${process.env.PORT}`));