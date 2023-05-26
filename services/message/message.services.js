import Room from "../../models/Room.js";
import Message from "../../models/Message.js";
import User from "../../models/User.js";
import db from "../database/db.services.js";

export const sendMessage = async(req, message) => {

    const senderId = req.user.id;
    const recipientId = req.url.split("/")[1];

    let room;
    
    //Users' room
    room = await Room.findOne({
        include: {
            model: User,
            where: {
                id: [senderId, recipientId]
            },
            attributes: ["id"]
        },
        group: ['Room.id'],
        having: db.literal(`COUNT(*) = 2`)
    });

    if(!room){

        // create new room
        room = await Room.create({});
        room.addUser([senderId, recipientId]);

    }

    //Create message
    await Message.create({
        senderId: senderId,
        recipientId: recipientId,
        roomId: room.id,
        text: message
    });

}