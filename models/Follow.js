import { DataTypes } from "sequelize";
import db from "../services/database/db.services.js";

const Follow = db.define("Follow", {

    followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    followingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isVisible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }

}, {timestamps: false});

await Follow.sync();
export default Follow;