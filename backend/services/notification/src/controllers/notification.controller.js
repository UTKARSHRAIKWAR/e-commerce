import nodemailer from "nodemailer"
import EmailLog from "../db/email.model.js";
import logger from "../utils/logger.js";

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

        logger.info("Email sent successfully", { to });

        await EmailLog.create({
            to,
            subject,
            body:html,
            status:"send"
        });

        res.json({message:"Email send"})
    } catch (error) {
        logger.error("Email sending failed", {
            error: error.message,
            stack: error.stack,
            to: req.body?.to
        });
        next(error);
    }
}


export const sendEmailEvent = async({to, subject, html})=> {
        try {
            await transporter.sendMail({
                from:process.env.EMAIL_USER,
                to,
                subject,
                html
            })
    
            logger.info("Event email sent", { to });
    
            await EmailLog.create({
                to,
                subject,
                body:html,
                status:"send"
            });
            
        } catch (error) {
            logger.error("Event email failed", {
            to,
            error: error.message
        });
    }
}