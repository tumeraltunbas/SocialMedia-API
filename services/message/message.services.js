import Room from "../../models/Room.js";
import Message from "../../models/Message.js";
import User from "../../models/User.js";

export const sendMessage = async(req, message) => {

    const participants = req.url.split("/")[1];
    const userIds = participants.split("-");
   
    const userOneId = userIds[0];
    const userTwoId = userIds[1];

    let room;

    
    //Users' room
    room = await Room.findOne({
        include: {
            model: User,
            where: {
                id: [userOneId, userTwoId]
            },
            attributes: ["id"]
        }
    });

    if(!room){

        //create new room

        await Room.create({});
        room.addUser(userOneId, userTwoId);

    }

    //Create message
    await Message.create({
        senderId: userOneId,
        recipientId: userTwoId,
        roomId: room.id,
        text: message
    });

}