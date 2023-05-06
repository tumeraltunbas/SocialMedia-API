import { DataTypes } from "sequelize";
import db from "../services/database/db.services.js";

const Block = db.define("Block", {

    BlockerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    BlockedId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

}, {timestamps: false});

await Block.sync();
export default Block;