import nodemailer from "nodemailer"
import EmailLog from "../db/email.model.js";

const transporter = nodemailer.createTransport(
    {
        service:"gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    }
)


export const sendEmail = async(req,res,next)=> {
    try {
        const {to, subject, html} = req.body;

        await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to,
            subject,
            html
        })

        await EmailLog.create({
            to,
            subject,
            body:html,
            status:"send"
        });

        res.json({message:"Email send"})
    } catch (error) {
        next(error);
    }
}