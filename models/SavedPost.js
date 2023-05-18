import { DataTypes } from "sequelize";
import db from "../services/database/db.services.js";

const SavedPost = db.define("SavedPost", {
    
    PostId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    UserId: {
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

await SavedPost.sync();
export default SavedPost;