import User from "./User.js";
import BackupCode from "./BackupCode.js";
import db from "../services/database/db.services.js";
import Post from "./Post.js";
import Like from "./Like.js";

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

await db.sync();
export {User, BackupCode}