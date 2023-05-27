import expressAsyncHandler from "express-async-handler";
import Message from "../models/Message.js";
import User from "../models/User.js";

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