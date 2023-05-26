import User from "./User.js";
import BackupCode from "./BackupCode.js";
import db from "../services/database/db.services.js";
import Post from "./Post.js";
import Like from "./Like.js";
import Follow from "./Follow.js";
import Comment from "./Comment.js";
import Block from "./Block.js";
import Report from "./Report.js";
import SavedPost from "./SavedPost.js";
import FollowRequest from "./FollowRequest.js";
import VerifyRequest from "./VerifyRequest.js";
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
User.belongsToMany(User, {
  foreignKey: "followingId",
  through: Follow,
  as: "followers",
});
User.belongsToMany(User, {
  foreignKey: "followerId",
  through: Follow,
  as: "following",
});

Follow.belongsTo(User, { foreignKey: "followerId" });
Follow.belongsTo(User, { foreignKey: "followingId" });

//User and Comment one to many
User.hasMany(Comment, { foreignKey: "UserId" });
Comment.belongsTo(User, { onDelete: "CASCADE" });

//Post and Comment ont to many
Post.hasMany(Comment, { foreignKey: "PostId" });
Comment.belongsTo(Post, { onDelete: "CASCADE" });

//Block
User.belongsToMany(User, {
  foreignKey: "BlockerId",
  through: Block,
  as: "blocker",
});
User.belongsToMany(User, {
  foreignKey: "BlockedId",
  through: Block,
  as: "blocked",
});

Block.belongsTo(User, { foreignKey: "BlockerId" });
Block.belongsTo(User, { foreignKey: "BlockedId" });

//User and Report one to many
User.hasMany(Report, { foreignKey: "UserId" });
Report.belongsTo(User, { onDelete: "CASCADE" });

//Post and Report one to many
Post.hasMany(Report, { foreignKey: "PostId" });
Report.belongsTo(Post, { onDelete: "CASCADE" });

//SavedPost
User.hasMany(SavedPost, { foreignKey: "UserId" });
SavedPost.belongsTo(User, { onDelete: "CASCADE" });

Post.hasMany(SavedPost, { foreignKey: "PostId" });
SavedPost.belongsTo(Post, { onDelete: "CASCADE" });

//Follow Requests
User.hasMany(FollowRequest, { foreignKey: "senderId" });
User.hasMany(FollowRequest, { foreignKey: "receiverId" });

FollowRequest.belongsTo(User, { foreignKey: "senderId", as: "sender" });
FollowRequest.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });

//VerifyRequest
User.hasMany(VerifyRequest, { foreignKey: "UserId" });
VerifyRequest.belongsTo(User, { onDelete: "CASCADE" });

//Room and user many to many
User.belongsToMany(Room, { through: "UserRooms" });
Room.belongsToMany(User, { through: "UserRooms" });

//Room and message one to many
Message.belongsTo(Room, { foreignKey: "RoomId" });
Room.hasMany(Message, { onDelete: "CASCADE" });

await db.sync();
export {
  User,
  BackupCode,
  Post,
  Like,
  Follow,
  Comment,
  Block,
  Report,
  FollowRequest,
  VerifyRequest,
  Room,
  Message,
};
