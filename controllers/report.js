import expressAsyncHandler from "express-async-handler";
import Report from "../models/Report.js";
import { capitalize } from "../utils/inputHelpers.js";
import CustomError from "../services/error/CustomError.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import moment from "moment/moment.js";
import {sendMail} from "../services/mail/mail.service.js";

export const reportPost = expressAsyncHandler(async(req, res, next) => {

    const {postId} = req.params;
    const {details} = req.body;

    if(!details){
        return next(new CustomError(400, "You must provide detail informations about report"));
    }

    const post = await Post.findOne({
        where: {
            id: postId
        },
        attributes: ["id", "UserId"]
    });

    if(post.UserId === req.user.id){
        return next(new CustomError(400, "You can not report your post"));
    }

    const report = await Report.findOne({
        where: {
            UserId: req.user.id,
            PostId: postId,
        },
        attributes: ["id"]
    });
    
    if(report){
        return next(new CustomError(400, "You have already reported this post"))
    }

    await Report.create({
        UserId: req.user.id,
        PostId: postId,
        details: capitalize(details)
    });

    return res
    .status(201)
    .json({
        success: true,
        message: "Post has been reported"
    });

});

export const getReportsByPostId = expressAsyncHandler(async(req, res, next) => {

    const { postId } = req.params;

    const reports = await Report.findAll({
        where: {
            PostId: postId,
            status: "Pending"
        },
        order: [["createdAt", "asc"]],
        include: [
            { 
                model: User, 
                attributes: ["id", "username"]
            },
        ]
    });

    return res
    .status(200)
    .json({
        success: true,
        reports: reports 
    });

});

export const getReportById = expressAsyncHandler(async(req, res, next) => {

    const {reportId} = req.params;
    
    const report = await Report.findOne({
        where: {
            id: reportId,
        },
        
        include: [
            { 
                model: User, 
                attributes: ["id", "username"]
            },
            {
                model: Post,
                attributes: ["id", "imageUrl", "content"],
                include: {
                    model: User,
                    attributes: ["id", "username"]
                }   
            }
        ]
    });

    return res
    .status(200)
    .json({
        success: true,
        report: report
    });

});

export const concludeReport = expressAsyncHandler(async(req, res, next) => {

    const {reportId} = req.params;
    const {status, resultMessage} = req.body;

    if(!resultMessage){
        return next(new CustomError(400, "You must provide a result message"));
    }

    const report = await Report.findOne({
        where: {
            id: reportId,
            status: "Pending"
        },
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName", "email"]
            },
            {
                model: Post,
                include: {
                    model: User,
                    attributes: ["id", "username"]
                },
                attributes: ["id"]
            }
        ]
    });

    if(!report){
        return next(new CustomError(400, "This report has already been concluded"));
    }

    report.status = capitalize(status);
    report.resultMessage = capitalize(resultMessage);

    if(report.status === "Accepted"){
        report.isVisible = false;
    }

    await report.save();

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: report.User.email,
        subject: `About your report in SocialMedia API`,
        html: `<p>Dear ${report.User.firstName} ${report.User.lastName}, <br><br>
        You have reported ${report.Post.User.username}'s post at ${moment(report.createdAt).format("DD.MM.YYYY HH:MM")}. <br>
        Your report has been ${status.toLowerCase()}. <br>
        Here is a message from admin: ${report.resultMessage}. <br><br>
        SocialMedia-API <br>
        Best Regards.</p>`
    }

    sendMail(mailOptions);

    return res
    .status(200)
    .json({
        success: true,
    });

});