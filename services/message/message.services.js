import Room from "../../models/Room.js";
import Message from "../../models/Message.js";
import User from "../../models/User.js";
import db from "../database/db.services.js";
import Follow from "../../models/Follow.js";

export const sendMessage = async(req, message, ws) => {

    const senderId = req.user.id;
    const recipientId = Number(req.url.split("/")[1]);

    if(senderId === recipientId){
        ws.send(JSON.stringify({error: "You can not send message to yourself"}));
        ws.close();
    }

    const follow = await Follow.findOne({
        where: {
            followerId: senderId,
            followingId: recipientId
        },
        attributes: ["id"]
    });

    if(!follow){
        ws.send(JSON.stringify({error: "You can not send message this user because you are not following"}));
        ws.close();        
    }

    let room;

    //Check is there a room
    room = await Room.findOne({
        include: [
            {
                model: User,
                where: {
                    id: senderId
                }
            },
            {
                model: User,
                where: {
                    id: recipientId
                }
            }
        ]
    });

    if(!room){

        //Create new room
        room = await Room.create({});
        await room.addUsers([senderId, recipientId]);
    }    

    //Create message
    await Message.create({
        SenderId: senderId,
        RecipientId: recipientId,
        RoomId: room.id,
        text: message
    });

}