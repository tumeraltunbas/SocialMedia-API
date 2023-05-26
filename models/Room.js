import db from "../services/database/db.services.js";
import { DataTypes } from "sequelize";

const Room = db.define("Room", {

    isVisible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

}, { timestamps: false });

await Room.sync();
export default Room