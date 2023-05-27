import Room from "../../models/Room.js";
import Message from "../../models/Message.js";
import User from "../../models/User.js";
import db from "../database/db.services.js";
import { Op, Sequelize } from "sequelize";

export const sendMessage = async(req, message) => {
    
    const senderId = req.user.id;
    const recipientId = req.url.split("/")[1];

    let room;

    room = await Room.findOne({
        include: {
            model: User,
            where: {
                id: [senderId, recipientId]
            }   
        }
    });

    if(!room){

        room = await Room.create({});

        await room.addUsers([senderId, recipientId]);
    }    

    //Create message
    await Message.create({
        senderId: senderId,
        recipientId: recipientId,
        roomId: room.id,
        text: message
    });

}