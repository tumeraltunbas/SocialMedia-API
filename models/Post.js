import { DataTypes } from "sequelize";
import db from "../services/database/db.services.js";
import Comment from "./Comment.js";
import Like from "./Like.js";
import SavedPost from "./SavedPost.js";

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

//Hooks
Post.addHook("beforeSave", async function(post){

    if(post.changed("isVisible")){

        await Comment.update(
            {
                isVisible: false
            },
            {
                PostId: post.id
            }
        );

        await Like.update(
            {
                isVisible: false
            },
            {
                PostId: post.id
            }
        );

        await SavedPost.update(
            {
                isVisible: false
            },
            {
                PostId: post.id
            }
        );
    }

});


await Post.sync();
export default Post;