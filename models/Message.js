import { DataTypes } from "sequelize";
import db from "../services/database/db.services.js";

const Message = db.define("Message", {

    SenderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    RecipientId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    RoomId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
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