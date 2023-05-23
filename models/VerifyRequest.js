import { DataTypes } from "sequelize";
import db from "../services/database/db.services.js";

const VerifyRequest = db.define("VerifyRequest", {

    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("Pending", "Concluced"),
        defaultValue: "Pending"
    },
    result: {
        type: DataTypes.STRING,
        allowNull: true
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

await VerifyRequest.sync();
export default VerifyRequest;