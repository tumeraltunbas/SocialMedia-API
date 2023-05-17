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
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

}, { timestamps: false });

await Message.sync();
export default Message;