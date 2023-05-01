import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({path: "./config/config.env"});

const {DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_DIALECT} = process.env;

const db = new Sequelize({
    host:DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASS,
    dialect: DB_DIALECT
});


try {
    await db.authenticate();
    console.log("Database connection successfull");
}
catch(err){
    console.log(err);
}

export default db;