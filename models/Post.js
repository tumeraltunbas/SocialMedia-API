import { DataTypes } from "sequelize";
import db from "../services/database/db.services.js";

const Post = db.define("Post", {

    content: {
        type: DataTypes.STRING,
    },
    imageUrl: {
        type: DataTypes.STRING
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

await Post.sync();
export default Post;