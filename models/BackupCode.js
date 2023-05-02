import db from "../services/database/db.services.js";
import { DataTypes } from "sequelize";

const BackupCode = db.define("BackupCode", {

    backupCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

}, {timestamps: false});


await BackupCode.sync();
export default BackupCode;