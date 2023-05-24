import { DataTypes, Op } from "sequelize";
import db from "../services/database/db.services.js";
import Like from "./Like.js";
import Post from "./Post.js";
import Comment from "./Comment.js";

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


Block.addHook("afterCreate", async function(block){

    const likes = await Like.findAll({
        where: {
            [Op.or]: [
                { UserId: block.BlockerId },
                { UserId: block.BlockedId }
            ]
        },
        include: {
            model: Post,
            where: {
                [Op.or] : [
                    { UserId: block.BlockedId },
                    { UserId: block.BlockerId}
                ]
            },
            attributes: [] 
        },
        attributes: [
            "id",
            "isVisible"
        ]
    });


    const comments = await Comment.findAll({
        where: {
            [Op.or]: [
                { UserId: block.BlockerId },
                { UserId: block.BlockedId }
            ]
        },
        include: {
            model: Post,
            where: {
                [Op.or] : [
                    { UserId: block.BlockedId },
                    { UserId: block.BlockerId}
                ]
            },
            attributes: [] 
        },
        attributes: [
            "id",
            "content",
        ]
    });

    likes.forEach(async(like) => {

        like.update({isVisible: false});
        await like.save();

    });

    comments.forEach(async(comment) => {

        comment.update({isVisible: false});
        await comment.save();
        
    });

});


Block.addHook("afterDestroy", async function(block){

    const likes = await Like.findAll({
        where: {
            [Op.or]: [
                { UserId: block.BlockerId },
                { UserId: block.BlockedId }
            ]
        },
        include: {
            model: Post,
            where: {
                [Op.or] : [
                    { UserId: block.BlockedId },
                    { UserId: block.BlockerId}
                ]
            },
            attributes: [] 
        },
        attributes: [
            "id",
            "isVisible"
        ]
    });


    const comments = await Comment.findAll({
        where: {
            [Op.or]: [
                { UserId: block.BlockerId },
                { UserId: block.BlockedId }
            ]
        },
        include: {
            model: Post,
            where: {
                [Op.or] : [
                    { UserId: block.BlockedId },
                    { UserId: block.BlockerId}
                ]
            },
            attributes: [] 
        },
        attributes: [
            "id",
            "content",
        ]
    });

    likes.forEach(async(like) => {

        like.update({isVisible: true});
        await like.save();

    });

    comments.forEach(async(comment) => {

        comment.update({isVisible: true});
        await comment.save();
        
    });

});

await Block.sync();
export default Block;