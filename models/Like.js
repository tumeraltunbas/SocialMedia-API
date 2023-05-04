import { DataTypes } from "sequelize";
import db from "../services/database/db.services.js";

const Like = db.define("Like", {

    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    PostId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

}, {timestamps: false});

await Like.sync();
export default Like;