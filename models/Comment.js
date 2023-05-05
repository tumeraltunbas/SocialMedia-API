import db from "../services/database/db.services.js";
import { DataTypes } from "sequelize";

const Comment = db.define("Comment", {

    content: {
        type: DataTypes.STRING,
    },
    imageUrl: {
        type: DataTypes.STRING,
    },
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
    isHidByUser: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

}, {timestamps: false});

await Comment.sync();
export default Comment;