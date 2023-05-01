import { DataTypes } from "sequelize";
import db from "../services/database/db.services.js";
import bcrypt from "bcryptjs";

const User = db.define("User", {

    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [2, 15],
                msg: "First Name must be between 2-15 characters"
            }
        },  
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [1, 15],
                msg: "Last Name must be between 1-15 characters"
            }
        },  
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            is: {
                args: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                msg: "Invalid email format"
            }
        }
    },
    password: {
        type: DataTypes.STRING,
    },
    gender: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            is: {
                args: /^\+[1-9]{1}[0-9]{7,11}$/ ,
                msg: "Invalid phone format"
            } 
        }
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    twoFactorSecret: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    isTwoFactorEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    emailVerificationToken: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    emailVerificationTokenExpires: {
        type: DataTypes.DATE,
        defaultValue: null  
    },
    isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    phoneCode: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    phoneCodeExpires: {
        type: DataTypes.DATE,
        defaultValue: null 
    },
    isPhoneVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    resetPasswordTokenExpires: {
        type: DataTypes.DATE,
        defaultValue: null
    },
    lastPasswordChangetAt: {
        type: DataTypes.DATE,
        defaultValue: null
    },
    isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }


}, {timestamps: false});


//Hooks
User.addHook("beforeSave", function(user){

    if(user.changed("password")){

        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(user.password, salt);

        user.password = hash;
    }

});