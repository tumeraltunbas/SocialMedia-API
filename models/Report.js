import { DataTypes } from "sequelize";
import db from "../services/database/db.services.js";

const Report = db.define("Report", {

    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    PostId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    details: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("Pending", "Concluded"),
        defaultValue: "Pending"
    },
    resultMessage: {
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

await Report.sync();
export default Report;