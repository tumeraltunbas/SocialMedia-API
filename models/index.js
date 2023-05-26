import User from "./User.js";
import BackupCode from "./BackupCode.js";
import db from "../services/database/db.services.js";
import Post from "./Post.js";
import Like from "./Like.js";
import Follow from "./Follow.js";
import Comment from "./Comment.js";
import Block from "./Block.js";
import Room from "./Room.js";
import Message from "./Message.js";

//User and BackupCode many to many
User.belongsToMany(BackupCode, { through: "UserBackupCodes" });
BackupCode.belongsToMany(User, { through: "UserBackupCodes" });

//User and Post one to many
Post.belongsTo(User, { foreignKey: "UserId" });
User.hasMany(Post, { onDelete: "CASCADE" });

//User and like one to many
User.hasMany(Like, { foreignKey: "UserId" });
Like.belongsTo(User, { onDelete: "CASCADE" });

//Post and like one to many
Post.hasMany(Like, { foreignKey: "PostId" });
Like.belongsTo(Post, { onDelete: "CASCADE" });

//Follow
User.belongsToMany(User, { foreignKey: "followingId", through: Follow, as: "followers" });
User.belongsToMany(User, { foreignKey: "followerId", through: Follow, as: "following" });

Follow.belongsTo(User, { foreignKey: 'followerId' });
Follow.belongsTo(User, { foreignKey: 'followingId' });

//User and Comment one to many
User.hasMany(Comment, { foreignKey: "UserId" });
Comment.belongsTo(User, { onDelete: "CASCADE" });

//Post and Comment ont to many
Post.hasMany(Comment, { foreignKey: "UserId" });
Comment.belongsTo(Post, { onDelete: "CASCADE" });

//Block
User.belongsToMany(User, { foreignKey: "BlockerId", through: Block, as: "blocker" });
User.belongsToMany(User, { foreignKey: "BlockedId", through: Block, as: "blocked" });

Block.belongsTo(User, { foreignKey: 'BlockerId' });
Block.belongsTo(User, { foreignKey: 'BlockedId' });

//Room and user many to many
User.belongsToMany(Room, { through: "UserRooms" });
Room.belongsToMany(User, { through: "UserRooms" });

//Room and message one to many
Message.belongsTo(Room, { foreignKey: "RoomId" });
Room.hasMany(Message, { onDelete: "CASCADE" });

await db.sync();
export {User, BackupCode, Post, Like, Follow, Comment, Block, Room};