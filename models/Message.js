import { DataTypes } from "sequelize";
import db from "../services/database/db.services.js";

const Message = db.define("Message", {

    sender: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    recipient: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    roomId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isVisible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

}, { timestamps: false });

await Message.sync();
export default Message;