import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({path: "./config/config.env"});

const {
    DB_HOST, 
    DB_PORT, 
    DB_USER, 
    DB_PASS, 
    DB_DIALECT, 
    DB_NAME
} = process.env;

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host:DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
});


try {
    await db.authenticate();
    console.log("Database connection successfull");
}
catch(err){
    console.log(err);
}

export default db;