import expressAsyncHandler from "express-async-handler";
import Message from "../models/Message.js";
import User from "../models/User.js";
import Room from "../models/Room.js";

export const getRoomsByUser = expressAsyncHandler(async(req, res, next) => {

    //Rooms that user subscribed
    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        attributes: ["id"],
        include: {
            model: Room,
            attributes: ["id"]
        }
    });

    //Room ids that user subscibed
    const subscribedRoomIds = user.Rooms.map(r => r.id);

    const users = await User.findAll({
        include: {
            model: Room,
            where: {
                id: subscribedRoomIds
            },
            attributes: ["id"]
        },
        attributes: [
            "id",
            "username",
            "profileImageUrl"
        ]
    });

    const filteredUsers = users.filter(u => u.id !== req.user.id);

    return res
    .status(200)
    .json({
        success: true,
        users: filteredUsers,
    });

});

export const getMessagesByRoomId = expressAsyncHandler(async(req, res, next) => {

    const {roomId} = req.params;

    const messages = await Message.findAll({
        where: {
            RoomId: roomId
        },
        include: [
            {
                model: User,
                attributes: [
                    "id",
                    "username",
                    "profileImageUrl"
                ],
                as: "sender"
            },
            {
                model: User,
                attributes: [
                    "id",
                    "username",
                    "profileImageUrl"
                ],
                as: "recipient"
            },
        ],
        attributes: [
            "id",
            "text",
            "createdAt"
        ]
    });

    return res
    .status(200)
    .json({
        success: true,
        messages: messages
    });

});

export const deleteMessage = expressAsyncHandler(async(req, res, next) => {

    const {roomId, messageId} = req.params;
    
    const message = await Message.findOne({
        where: {
            id: messageId,
            RoomId: roomId
        }
    });

    await message.destroy();

    return res
    .status(200)
    .json({
        success: true,
        message: "Message has been deleted"
    });

});
