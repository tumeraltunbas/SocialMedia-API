import { DataTypes } from "sequelize";
import db from "../services/database/db.services.js";

const VerifyRequest = db.define("VerifyRequest", {

    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("Pending", "Concluced"),
        allowNull: true
    },
    result: {
        type: DataTypes.ENUM("Accepted", "Rejected"),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

}, { timestamps: false });

await VerifyRequest.sync();
export default VerifyRequest;