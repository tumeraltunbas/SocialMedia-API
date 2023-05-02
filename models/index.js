import User from "./User.js";
import BackupCode from "./BackupCode.js";
import db from "../services/database/db.services.js";

//User and BackupCode many to many
User.belongsToMany(BackupCode, { through: "UserBackupCodes" });
BackupCode.belongsToMany(User, { through: "UserBackupCodes" });




await db.sync();
export {User, BackupCode}