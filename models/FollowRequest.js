import db from "../services/database/db.services.js";
import { DataTypes } from "sequelize";

const FollowRequest = db.define("FollowRequest", {

    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    receiverId: {
        type: DataTypes.INTEGER,
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

await FollowRequest.sync();
export default FollowRequest;