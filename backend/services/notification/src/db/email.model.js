import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
    {
        to:{
            type:String
        },
        subject:{
            type:String
        },
        body:{
            type:String
        },
        status:{
            type:String
        }
    },
    {timestamps:true}
)

const EmailLog = mongoose.model("EmailLog",emailSchema)

export default EmailLog